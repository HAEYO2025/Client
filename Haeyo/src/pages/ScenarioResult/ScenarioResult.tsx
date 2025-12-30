import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createScenarioWithStreaming, type Choice } from '../../api/scenarios';
import type { Report } from '../../types/report';
import styles from './ScenarioResult.module.css';

interface LocationState {
  selectedReport: Report;
  scenarioTitle: string;
  scenarioDescription: string;
  startDate: string;
}

export const ScenarioResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [situation, setSituation] = useState('');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFog, setShowFog] = useState(false);
  const [showChoices, setShowChoices] = useState(true);
  const [customChoiceText, setCustomChoiceText] = useState('');

  const situationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state?.selectedReport) {
      navigate('/scenario/create');
      return;
    }

    const startStreaming = async () => {
      await createScenarioWithStreaming(
        state.selectedReport,
        state.scenarioTitle,
        state.scenarioDescription,
        state.startDate,
        (chunk) => {
          if (chunk.type === 'situation' && chunk.content) {
            // Show fog effect only when situation first starts
            setSituation((prev) => {
              if (!prev) {
                setShowFog(true);
                setTimeout(() => setShowFog(false), 1500);
              }
              return prev + chunk.content;
            });
            setChoices([]); // Clear previous choices
            setShowChoices(false);
          } else if (chunk.type === 'choice' && chunk.choices) {
            setChoices((prev) => mergeChoices(prev, chunk.choices || []));
            setIsStreaming(false);
            setShowChoices(true);
          } else if (chunk.type === 'done') {
            setIsStreaming(false);
          } else if (chunk.type === 'error') {
            setError(chunk.error || '오류가 발생했습니다.');
            setIsStreaming(false);
          }
        }
      );
    };

    startStreaming();
  }, [state, navigate]);

  // Auto-scroll to bottom of situation container as text grows
  useEffect(() => {
    if (situationRef.current) {
      situationRef.current.scrollTop = situationRef.current.scrollHeight;
    }
  }, [situation]);

  const handleCancel = () => {
    navigate('/scenario/create');
  };

  const handleRetry = () => {
    setSituation('');
    setChoices([]);
    setError(null);
    setIsStreaming(true);
    setShowFog(false);

    createScenarioWithStreaming(
      state.selectedReport,
      state.scenarioTitle,
      state.scenarioDescription,
      state.startDate,
      (chunk) => {
        if (chunk.type === 'situation' && chunk.content) {
          // Show fog effect only when situation first starts
          setSituation((prev) => {
            if (!prev) {
              setShowFog(true);
              setTimeout(() => setShowFog(false), 1500);
            }
            return prev + chunk.content;
          });
          setChoices([]);
          setShowChoices(false);
        } else if (chunk.type === 'choice' && chunk.choices) {
          setChoices((prev) => mergeChoices(prev, chunk.choices || []));
          setIsStreaming(false);
          setShowChoices(true);
        } else if (chunk.type === 'done') {
          setIsStreaming(false);
        } else if (chunk.type === 'error') {
          setError(chunk.error || '오류가 발생했습니다.');
          setIsStreaming(false);
        }
      }
    );
  };

  const mergeChoices = (prev: Choice[], next: Choice[]) => {
    if (prev.length === 0) {
      return next;
    }
    if (next.length === 0) {
      return prev;
    }

    const merged = new Map<string, Choice>();
    prev.forEach((choice) => merged.set(choice.id, choice));

    next.forEach((incoming) => {
      const existing = merged.get(incoming.id);
      if (!existing) {
        merged.set(incoming.id, incoming);
        return;
      }

      if (incoming.text.startsWith(existing.text)) {
        merged.set(incoming.id, incoming);
        return;
      }

      if (existing.text.startsWith(incoming.text)) {
        return;
      }

      merged.set(incoming.id, {
        ...incoming,
        text: `${existing.text}${incoming.text}`,
      });
    });

    return Array.from(merged.values());
  };

  const handleChoiceSelect = (choice: Choice) => {
    // TODO: Send selected choice back to API and continue scenario
    console.log('Selected choice:', choice);
    // For now, just mark as complete and navigate
    alert(`선택: ${choice.text}`);
  };

  const handleCustomChoiceSubmit = () => {
    const trimmed = customChoiceText.trim();
    if (!trimmed) {
      return;
    }
    handleChoiceSelect({ id: `custom-${Date.now()}`, text: trimmed });
    setCustomChoiceText('');
  };

  const handleConfirm = () => {
    // TODO: Save scenario and navigate to scenario detail or home
    navigate('/');
  };

  const toggleChoices = () => {
    setShowChoices((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleCancel}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M15 9H1M1 9L8 16M1 9L8 2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>시나리오: {state?.scenarioTitle || '제목'}</h1>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Error message */}
        {error && (
          <div className={styles.errorMessage}>
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Situation Display with Fog Effect */}
        {situation && (
          <div
            ref={situationRef}
            className={`${styles.situationContainer} ${showFog ? styles.foggy : ''} ${!showChoices ? styles.expandedSituation : ''}`}
          >
            <p className={styles.situationText}>{situation}</p>
          </div>
        )}

        {/* Choice Buttons */}
        {choices.length > 0 && (
          <>
            <button className={styles.choiceToggle} onClick={toggleChoices}>
              {showChoices ? '선택지 접기' : '선택지 보기'}
            </button>
            {showChoices && (
              <div className={styles.choicesContainer}>
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    className={styles.choiceBtn}
                    onClick={() => handleChoiceSelect(choice)}
                  >
                    {choice.text}
                  </button>
                ))}
                <div className={styles.customChoice}>
                  <input
                    className={styles.customInput}
                    placeholder="직접 입력하기"
                    value={customChoiceText}
                    onChange={(event) => setCustomChoiceText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleCustomChoiceSubmit();
                      }
                    }}
                  />
                  <button
                    className={styles.customSubmit}
                    type="button"
                    onClick={handleCustomChoiceSubmit}
                  >
                    전송
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Streaming indicator */}
        {isStreaming && !situation && (
          <div className={styles.streamingIndicator}>
            시나리오 생성 중...
          </div>
        )}
      </main>

      {/* Bottom Actions */}
      <div className={styles.bottomBar}>
        <button className={styles.actionBtn} onClick={handleCancel} title="취소">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          className={styles.actionBtn}
          onClick={handleRetry}
          disabled={isStreaming}
          title="재생성"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12a8 8 0 0 1 14.5-4.5M20 12a8 8 0 0 1-14.5 4.5M4 8v4h4m12 0v4h-4" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className={styles.actionBtn}
          onClick={handleConfirm}
          disabled={isStreaming || !!error}
          title="완료"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
