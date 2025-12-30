import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ScenarioFeedback, ScenarioSurvivalRate } from '../../api/scenarios';
import styles from './ScenarioFeedback.module.css';

interface FeedbackEntry {
  situation: string;
  choice: string;
  feedback: ScenarioFeedback;
}

interface FeedbackLocationState {
  scenarioTitle: string;
  feedbackEntries: FeedbackEntry[];
  survivalRate: ScenarioSurvivalRate | null;
}

const evaluationTone = (evaluation: string) => {
  const normalized = evaluation.toLowerCase();
  if (normalized.includes('danger')) {
    return styles.toneDanger;
  }
  if (normalized.includes('safe') || normalized.includes('good')) {
    return styles.toneSafe;
  }
  return styles.toneCaution;
};

export const ScenarioFeedback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as FeedbackLocationState | undefined;

  useEffect(() => {
    if (!state) {
      navigate('/scenario/create');
    }
  }, [state, navigate]);

  if (!state) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M15 9H1M1 9L8 16M1 9L8 2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>피드백: {state.scenarioTitle}</h1>
      </header>

      <main className={styles.main}>
        {state.survivalRate && (
          <section className={styles.rateCard}>
            <span className={styles.rateLabel}>생존율</span>
            <div className={styles.rateValue}>
              <span>{state.survivalRate.survival_rate}%</span>
              {state.survivalRate.change && (
                <em className={styles.rateChange}>{state.survivalRate.change}</em>
              )}
            </div>
          </section>
        )}

        <section className={styles.feedbackList}>
          {state.feedbackEntries.length === 0 && (
            <p className={styles.emptyState}>피드백이 아직 없습니다.</p>
          )}
          {state.feedbackEntries.map((entry, index) => (
            <article key={`${entry.choice}-${index}`} className={styles.feedbackCard}>
              <span className={styles.turnLabel}>턴 {index + 1}</span>
              <h2 className={styles.situation}>{entry.situation}</h2>
              <div className={styles.choiceRow}>
                <span className={styles.choiceLabel}>선택</span>
                <span className={styles.choiceText}>{entry.choice}</span>
              </div>
              <div className={styles.evaluationRow}>
                <span className={`${styles.evaluationTag} ${evaluationTone(entry.feedback.evaluation)}`}>
                  {entry.feedback.evaluation || '주의'}
                </span>
                <span className={styles.impactText}>{entry.feedback.survival_impact}</span>
              </div>
              <p className={styles.comment}>{entry.feedback.comment}</p>
              {entry.feedback.better_choice && (
                <div className={styles.betterChoice}>
                  <span className={styles.betterLabel}>대안</span>
                  <span className={styles.betterText}>{entry.feedback.better_choice}</span>
                </div>
              )}
            </article>
          ))}
        </section>
      </main>

      <div className={styles.bottomBar}>
        <button className={styles.homeBtn} onClick={() => navigate('/home')}>
          홈으로
        </button>
      </div>
    </div>
  );
};
