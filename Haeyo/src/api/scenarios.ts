import type { Report } from '../types/report';

export interface ScenarioRequest {
  report: {
    title: string;
    description: string;
    latitude: number;
    longitude: number;
    reported_date: string;
  };
  scenario: {
    title: string;
    description: string;
    start_date: string;
  };
}

export interface Choice {
  id: string;
  text: string;
}

export interface ScenarioStreamChunk {
  type: 'situation' | 'choice' | 'done' | 'error';
  content?: string;
  choices?: Choice[];
  error?: string;
}

const toChoice = (value: unknown, fallbackId: number): Choice | null => {
  if (typeof value === 'string') {
    const text = value.trim();
    if (!text) {
      return null;
    }
    return { id: `${fallbackId}`, text };
  }

  if (value && typeof value === 'object') {
    const record = value as { id?: string | number; text?: string; label?: string };
    const text = (record.text || record.label || '').trim();
    if (!text) {
      return null;
    }
    const idValue = record.id ?? fallbackId;
    return { id: `${idValue}`, text };
  }

  return null;
};

const normalizeChoices = (choices: unknown): Choice[] => {
  if (!Array.isArray(choices)) {
    return [];
  }

  const normalized: Choice[] = [];
  choices.forEach((value, index) => {
    const choice = toChoice(value, index);
    if (choice) {
      normalized.push(choice);
    }
  });
  return normalized;
};

const parseChoiceContent = (content: unknown): Choice[] => {
  if (typeof content !== 'string') {
    return [];
  }

  return content
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const text = line.replace(/^\s*[\d-]+[.)-]?\s*/, '').trim();
      return { id: `${index}`, text: text || line };
    });
};

/**
 * Create a scenario and receive streaming response
 * Uses Server-Sent Events (SSE) for streaming
 */
export const createScenarioWithStreaming = async (
  selectedReport: Report,
  scenarioTitle: string,
  scenarioDescription: string,
  startDate: string,
  onChunk: (chunk: ScenarioStreamChunk) => void,
): Promise<void> => {
  const requestBody: ScenarioRequest = {
    report: {
      title: selectedReport.content.substring(0, 50), // Use content as title if needed
      description: selectedReport.content,
      latitude: selectedReport.location.latitude,
      longitude: selectedReport.location.longitude,
      reported_date: new Date(Date.now() - parseInt(selectedReport.timeAgo) * 3600000).toISOString(),
    },
    scenario: {
      title: scenarioTitle,
      description: scenarioDescription,
      start_date: startDate,
    },
  };

  try {
    const response = await fetch('http://0.0.0.0:8000/api/query/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No reader available');
    }

    let currentEvent: string | null = null;

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onChunk({ type: 'done' });
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        if (!line) {
          continue;
        }

        if (line.startsWith('event:')) {
          currentEvent = line.slice(6).trim();
          continue;
        }

        if (line.startsWith('data:') || line.startsWith('data: ')) {
          const data = line.replace(/^data:\s?/, '');
          console.log('[SSE:data]', data, 'event:', currentEvent);
          if (data === '[DONE]') {
            onChunk({ type: 'done' });
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            console.log('[SSE:parsed]', parsed, 'event:', currentEvent);
            const rawEventType = (parsed.type || currentEvent || '').toString();
            const eventType = rawEventType.startsWith('choice') ? 'choice' : rawEventType;

            // Handle done signal
            if (parsed.done === 'true' || parsed.done === true) {
              onChunk({ type: 'done' });
              continue;
            }

            // Handle different event types from the stream
            if (eventType === 'situation') {
              onChunk({ type: 'situation', content: parsed.content || parsed.situation });
            } else if (eventType === 'choice') {
              if (rawEventType.startsWith('choice')) {
                const text = (parsed.content || parsed.choice || parsed.text || parsed.label || '').trim();
                if (text) {
                  onChunk({
                    type: 'choice',
                    choices: [{ id: rawEventType, text }],
                  });
                }
              } else {
                const normalizedChoices = normalizeChoices(parsed.choices);
                const contentChoices = parseChoiceContent(parsed.content || parsed.choice);
                onChunk({
                  type: 'choice',
                  choices: normalizedChoices.length > 0 ? normalizedChoices : contentChoices,
                });
              }
            } else if (parsed.content || parsed.situation) {
              // Fallback: if there's content but no type, treat as situation
              onChunk({ type: 'situation', content: parsed.content || parsed.situation });
            }
            // Ignore any other JSON objects without content
          } catch {
            // If not JSON and not empty, treat as raw text situation
            if (data.trim()) {
              if (currentEvent && currentEvent.startsWith('choice')) {
                const text = data.trim();
                if (text) {
                  onChunk({ type: 'choice', choices: [{ id: currentEvent, text }] });
                }
              } else if (currentEvent === 'choice') {
                const contentChoices = parseChoiceContent(data);
                onChunk({ type: 'choice', choices: contentChoices });
              } else {
                onChunk({ type: 'situation', content: data });
              }
            }
          }

          currentEvent = null;
        }
      }
    }
  } catch (error) {
    onChunk({
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};
