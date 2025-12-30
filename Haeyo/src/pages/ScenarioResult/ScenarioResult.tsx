import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  createScenarioWithStreaming,
  type Choice,
  type ScenarioFeedback,
  type ScenarioHistoryEntry,
  type ScenarioSurvivalRate,
  type ScenarioStreamChunk,
} from '../../api/scenarios';
import type { Report } from '../../types/report';
import styles from './ScenarioResult.module.css';

interface LocationState {
  selectedReport: Report;
  scenarioTitle: string;
  scenarioDescription: string;
  startDate: string;
}

interface ScenarioPage {
  situation: string;
  choices: Choice[];
  selectedChoice?: Choice;
  feedback?: ScenarioFeedback;
}

export const ScenarioResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [pages, setPages] = useState<ScenarioPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFog, setShowFog] = useState(false);
  const [showChoices, setShowChoices] = useState(true);
  const [customChoiceText, setCustomChoiceText] = useState('');
  const [survivalRate, setSurvivalRate] = useState<ScenarioSurvivalRate | null>(null);

  const situationRef = useRef<HTMLDivElement>(null);
  const hasAutoNavigated = useRef(false);

  const getStreamHandler = (pageIndex: number) => (chunk: ScenarioStreamChunk) => {
    if (chunk.type === 'situation' && chunk.content) {
      // Show fog effect only when situation first starts
      setPages((prev) => {
        const next = [...prev];
        const current = next[pageIndex] || { situation: '', choices: [] };
        if (!current.situation) {
          setShowFog(true);
          setTimeout(() => setShowFog(false), 1500);
        }
        next[pageIndex] = {
          ...current,
          situation: `${current.situation}${chunk.content}`,
          choices: [],
        };
        return next;
      });
      setShowChoices(false);
    } else if (chunk.type === 'choice' && chunk.choices) {
      setPages((prev) => {
        const next = [...prev];
        const current = next[pageIndex] || { situation: '', choices: [] };
        next[pageIndex] = {
          ...current,
          choices: mergeChoices(current.choices, chunk.choices || []),
        };
        return next;
      });
      setIsStreaming(false);
      setShowChoices(true);
    } else if (chunk.type === 'feedback' && chunk.feedback) {
      setPages((prev) => {
        const next = [...prev];
        const targetIndex = Math.max(pageIndex - 1, 0);
        const current = next[targetIndex];
        if (!current) {
          return prev;
        }
        next[targetIndex] = { ...current, feedback: chunk.feedback };
        return next;
      });
    } else if (chunk.type === 'survival_rate' && chunk.survivalRate) {
      setSurvivalRate(chunk.survivalRate);
    } else if (chunk.type === 'done') {
      setIsStreaming(false);
    } else if (chunk.type === 'error') {
      setError(chunk.error || '오류가 발생했습니다.');
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (!state?.selectedReport) {
      navigate('/scenario/create');
      return;
    }

    const startStreaming = async () => {
      setPages([{ situation: '', choices: [] }]);
      setCurrentPageIndex(0);
      setSurvivalRate(null);
      hasAutoNavigated.current = false;
      await createScenarioWithStreaming(
        state.selectedReport,
        state.scenarioTitle,
        state.scenarioDescription,
        state.startDate,
        getStreamHandler(0)
      );
    };

    startStreaming();
  }, [state, navigate]);

  // Auto-scroll to bottom of situation container as text grows
  useEffect(() => {
    if (situationRef.current) {
      situationRef.current.scrollTop = situationRef.current.scrollHeight;
    }
  }, [pages, currentPageIndex]);

  const handleCancel = () => {
    navigate('/scenario/create');
  };

  const handleRetry = () => {
    setPages([{ situation: '', choices: [] }]);
    setCurrentPageIndex(0);
    setError(null);
    setIsStreaming(true);
    setShowFog(false);
    setSurvivalRate(null);
    hasAutoNavigated.current = false;

    createScenarioWithStreaming(
      state.selectedReport,
      state.scenarioTitle,
      state.scenarioDescription,
      state.startDate,
      getStreamHandler(0)
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

  const buildHistory = (
    items: ScenarioPage[],
    uptoIndex: number,
    overrideChoice?: Choice,
  ): ScenarioHistoryEntry[] => {
    const history: ScenarioHistoryEntry[] = [];
    items.slice(0, uptoIndex + 1).forEach((page, index) => {
      if (!page?.situation) {
        return;
      }
      const selected = index === uptoIndex && overrideChoice ? overrideChoice : page.selectedChoice;
      if (!selected) {
        return;
      }
      history.push({ situation: page.situation, choice: selected.text });
    });
    return history;
  };

  const buildFeedbackEntries = () =>
    pages
      .filter((page) => page.selectedChoice && page.feedback)
      .map((page) => ({
        situation: page.situation,
        choice: page.selectedChoice?.text ?? '',
        feedback: page.feedback as ScenarioFeedback,
      }));

  useEffect(() => {
    const feedbackCount = pages.filter((page) => page.feedback).length;
    if (feedbackCount >= 10 && !hasAutoNavigated.current) {
      hasAutoNavigated.current = true;
      navigate('/scenario/feedback', {
        state: {
          scenarioTitle: state?.scenarioTitle ?? '제목',
          feedbackEntries: buildFeedbackEntries(),
          survivalRate,
        },
      });
    }
  }, [pages, navigate, state?.scenarioTitle, survivalRate]);

  const handleChoiceSelect = (choice: Choice) => {
    if (currentPageIndex !== pages.length - 1) {
      return;
    }
    console.log('Selected choice:', choice);
    const history = buildHistory(pages, currentPageIndex, choice);

    const nextIndex = pages.length;
    setPages((prev) => {
      const next = [...prev];
      const current = next[currentPageIndex];
      if (current) {
        next[currentPageIndex] = { ...current, selectedChoice: choice };
      }
      next.push({ situation: '', choices: [] });
      return next;
    });
    setCurrentPageIndex(nextIndex);
    setError(null);
    setIsStreaming(true);
    setShowFog(false);
    setShowChoices(false);

    createScenarioWithStreaming(
      state.selectedReport,
      state.scenarioTitle,
      state.scenarioDescription,
      state.startDate,
      getStreamHandler(nextIndex),
      {
        history,
      }
    );
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
    navigate('/scenario/feedback', {
      state: {
        scenarioTitle: state?.scenarioTitle ?? '제목',
        feedbackEntries: buildFeedbackEntries(),
        survivalRate,
      },
    });
  };

  const toggleChoices = () => {
    setShowChoices((prev) => !prev);
  };

  const goToPreviousPage = () => {
    setCurrentPageIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPageIndex((prev) => Math.min(prev + 1, pages.length - 1));
  };

  useEffect(() => {
    const currentChoices = pages[currentPageIndex]?.choices || [];
    setShowChoices(currentChoices.length > 0);
  }, [pages, currentPageIndex]);

  const isHistoryView = pages.length > 0 && currentPageIndex !== pages.length - 1;
  const currentPage = pages[currentPageIndex];
  const selectedChoice = currentPage?.selectedChoice;

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

        {pages.length > 0 && (
          <div className={styles.pageNav}>
            <button
              className={styles.pageNavBtn}
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 0}
              type="button"
            >
              &lt;
            </button>
            <span className={styles.pageNavLabel}>
              {currentPageIndex + 1} / {pages.length}
            </span>
            <button
              className={styles.pageNavBtn}
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
              type="button"
            >
              &gt;
            </button>
          </div>
        )}

        {/* Situation Display with Fog Effect */}
        {currentPage?.situation && (
          <div
            ref={situationRef}
            className={`${styles.situationContainer} ${showFog ? styles.foggy : ''} ${!showChoices ? styles.expandedSituation : ''}`}
          >
            <p className={styles.situationText}>{currentPage?.situation}</p>
          </div>
        )}

        {isHistoryView && selectedChoice && (
          <div className={styles.selectedChoiceCard}>
            <span className={styles.selectedChoiceLabel}>선택한 행동</span>
            <span className={styles.selectedChoiceText}>{selectedChoice.text}</span>
          </div>
        )}

        {/* Choice Buttons */}
        {currentPage?.choices.length > 0 && (
          <>
            <button className={styles.choiceToggle} onClick={toggleChoices} type="button">
              {showChoices ? '선택지 접기' : '선택지 보기'}
            </button>
            {showChoices && (
              <div className={styles.choicesContainer}>
                {currentPage?.choices.map((choice) => (
                  <button
                    key={choice.id}
                    className={`${styles.choiceBtn} ${selectedChoice?.id === choice.id ? styles.choiceSelected : ''}`}
                    onClick={() => handleChoiceSelect(choice)}
                    disabled={isHistoryView}
                  >
                    {choice.text}
                  </button>
                ))}
                <div className={styles.customChoice}>
                  <input
                    className={styles.customInput}
                    placeholder={isHistoryView ? '최신 페이지에서 입력 가능' : '직접 입력하기'}
                    value={customChoiceText}
                    onChange={(event) => setCustomChoiceText(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleCustomChoiceSubmit();
                      }
                    }}
                    disabled={isHistoryView}
                  />
                  <button
                    className={styles.customSubmit}
                    type="button"
                    onClick={handleCustomChoiceSubmit}
                    disabled={isHistoryView}
                  >
                    전송
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Streaming indicator */}
        {isStreaming && !pages[currentPageIndex]?.situation && (
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
