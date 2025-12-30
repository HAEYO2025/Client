import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { SafetyGuideData } from '../../types/safetyGuide';
import styles from './SafetyGuide.module.css';

interface SafetyGuideLocationState extends SafetyGuideData {}

const formatDate = (value?: string) => {
  if (!value || value.length !== 8) {
    return value || '';
  }
  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
};

const riskMeta = (level?: string) => {
  const normalized = (level || '').toLowerCase();
  if (normalized === 'critical') {
    return { label: '위험', className: styles.riskCritical };
  }
  if (normalized === 'warning' || normalized === 'high') {
    return { label: '주의', className: styles.riskWarning };
  }
  if (normalized === 'moderate') {
    return { label: '경계', className: styles.riskModerate };
  }
  return { label: '안전', className: styles.riskSafe };
};

const toNumber = (value?: string) => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const SafetyGuide = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as SafetyGuideLocationState | undefined;

  useEffect(() => {
    if (!state) {
      navigate('/training');
    }
  }, [state, navigate]);

  const tideSeries = useMemo(() => {
    const data = state?.ocean_data?.result?.data || [];
    return data
      .map((entry) => ({
        level: toNumber(entry.tide_level),
        time: entry.record_time,
      }))
      .filter((entry) => entry.level !== null) as Array<{ level: number; time: string }>;
  }, [state]);

  const tidePreview = tideSeries.slice(-36);
  const tideLatest = tideSeries[tideSeries.length - 1];

  const chartPath = useMemo(() => {
    if (tidePreview.length === 0) {
      return '';
    }
    const width = 240;
    const height = 72;
    const padding = 6;
    const levels = tidePreview.map((point) => point.level);
    const min = Math.min(...levels);
    const max = Math.max(...levels);
    const range = max - min || 1;
    return tidePreview
      .map((point, index) => {
        const x = padding + (index / (tidePreview.length - 1)) * (width - padding * 2);
        const y = height - padding - ((point.level - min) / range) * (height - padding * 2);
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [tidePreview]);

  if (!state) {
    return null;
  }

  const riskInfo = riskMeta(state.risk_level);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M15 9H1M1 9L8 16M1 9L8 2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>안전 가이드</h1>
      </header>

      <main className={styles.main}>
        <section className={styles.heroCard}>
          <div className={styles.heroTop}>
            <div>
              <p className={styles.heroLabel}>위험도</p>
              <div className={styles.heroScore}>
                <span>{state.risk_score ?? '--'}</span>
                <span className={`${styles.heroBadge} ${riskInfo.className}`}>{riskInfo.label}</span>
              </div>
            </div>
            <div className={styles.heroMeta}>
              <span>{formatDate(state.date)}</span>
              {state.station_info?.obs_name && (
                <span>관측소 {state.station_info.obs_name}</span>
              )}
            </div>
          </div>
          <p className={styles.heroSummary}>{state.summary || '안전 가이드 정보를 확인하세요.'}</p>
          <div className={styles.heroLocation}>
            <span>좌표 {state.location.latitude.toFixed(4)}, {state.location.longitude.toFixed(4)}</span>
            {state.station_info?.distance_km !== undefined && (
              <span>관측소까지 {state.station_info.distance_km.toFixed(1)}km</span>
            )}
          </div>
        </section>

        <section className={styles.grid}>
          <div className={styles.infoCard}>
            <h2 className={styles.cardTitle}>경고</h2>
            <ul className={styles.list}>
              {(state.warnings || []).map((warning, index) => (
                <li key={`warning-${index}`}>{warning}</li>
              ))}
              {!state.warnings?.length && <li>현재 등록된 경고가 없습니다.</li>}
            </ul>
          </div>
          <div className={styles.infoCard}>
            <h2 className={styles.cardTitle}>권고 사항</h2>
            <ul className={styles.list}>
              {(state.recommendations || []).map((recommendation, index) => (
                <li key={`recommend-${index}`}>{recommendation}</li>
              ))}
              {!state.recommendations?.length && <li>현재 권고 사항이 없습니다.</li>}
            </ul>
          </div>
        </section>

        <section className={styles.tideCard}>
          <div className={styles.tideHeader}>
            <div>
              <h2 className={styles.cardTitle}>조위 추이</h2>
              <p className={styles.tideMeta}>
                {tideLatest ? `최신 ${tideLatest.level} · ${tideLatest.time}` : '데이터 없음'}
              </p>
            </div>
            {state.station_info?.obs_name && (
              <span className={styles.stationTag}>{state.station_info.obs_name}</span>
            )}
          </div>
          {tidePreview.length > 0 ? (
            <svg viewBox="0 0 240 72" className={styles.tideChart}>
              <path d={chartPath} className={styles.tidePath} />
            </svg>
          ) : (
            <div className={styles.emptyTide}>조위 데이터가 없습니다.</div>
          )}
        </section>

        <section className={styles.infoCard}>
          <h2 className={styles.cardTitle}>긴급 연락처</h2>
          <div className={styles.contactList}>
            {(state.emergency_contacts || []).map((contact, index) => (
              <span key={`contact-${index}`} className={styles.contactChip}>{contact}</span>
            ))}
            {!state.emergency_contacts?.length && (
              <span className={styles.contactChip}>등록된 연락처가 없습니다.</span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
