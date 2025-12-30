import { useLocation, useNavigate } from 'react-router-dom';
import type { SafetyGuideData } from '../../types/safetyGuide';
import styles from './SafetyGuideWeb.module.css';

export const SafetyGuideWeb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as SafetyGuideData | undefined;
  const cachedState = (() => {
    try {
      const raw = sessionStorage.getItem('safetyGuideData');
      return raw ? (JSON.parse(raw) as SafetyGuideData) : undefined;
    } catch {
      return undefined;
    }
  })();
  const data = state || cachedState;

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          <h2>데이터를 불러올 수 없습니다</h2>
          <button onClick={() => navigate('/training')} className={styles.backButton}>
            돌아가기
          </button>
        </div>
      </div>
    );
  }

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

  const tideData = data.ocean_data?.result?.data || [];
  const tidePreview = tideData.slice(-72); // 최근 12시간
  
  const formatDate = (value?: string) => {
    if (!value || value.length !== 8) {
      return value || '';
    }
    return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
  };
  
  const riskInfo = riskMeta(data.risk_level);

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
        <section className={styles.riskCard}>
          <div className={styles.riskHeader}>
            <div className={styles.riskScore}>{data.risk_score ?? '--'}</div>
            <span className={`${styles.riskBadge} ${riskInfo.className}`}>{riskInfo.label}</span>
          </div>
          <p className={styles.summary}>{data.summary || '안전 가이드 정보를 확인하세요.'}</p>
          <div className={styles.chartLegend}>
            <span>{formatDate(data.date)}</span>
            {data.station_info?.obs_name && (
              <span>관측소 {data.station_info.obs_name}</span>
            )}
          </div>
        </section>

        <section className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>경고</h2>
            <ul className={styles.warningList}>
              {(data.warnings || []).map((warning, index) => (
                <li key={`warning-${index}`} className={styles.warningItem}>{warning}</li>
              ))}
              {!data.warnings?.length && <li className={styles.warningItem}>현재 등록된 경고가 없습니다.</li>}
            </ul>
          </div>
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>권고 사항</h2>
            <ul className={styles.recommendationList}>
              {(data.recommendations || []).map((recommendation, index) => (
                <li key={`recommend-${index}`} className={styles.recommendationItem}>{recommendation}</li>
              ))}
              {!data.recommendations?.length && <li className={styles.recommendationItem}>현재 권고 사항이 없습니다.</li>}
            </ul>
          </div>
        </section>

        {tidePreview.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>조위 추이</h2>
            <div className={styles.chartContainer}>
              <svg viewBox="0 0 480 140" className={styles.chart}>
                <path
                  d={tidePreview.map((item, i) => {
                    const width = 480;
                    const height = 140;
                    const padding = 10;
                    const levels = tidePreview.map(d => parseInt(d.tide_level));
                    const min = Math.min(...levels);
                    const max = Math.max(...levels);
                    const range = max - min || 1;
                    const x = padding + (i / (tidePreview.length - 1)) * (width - padding * 2);
                    const y = height - padding - ((parseInt(item.tide_level) - min) / range) * (height - padding * 2);
                    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
                  }).join(' ')}
                  className={styles.chartPath}
                />
              </svg>
              <div className={styles.chartLegend}>
                <span>최신 {tidePreview[tidePreview.length - 1]?.tide_level} · {tidePreview[tidePreview.length - 1]?.record_time}</span>
                {data.station_info?.obs_name && <span>{data.station_info.obs_name}</span>}
              </div>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>긴급 연락처</h2>
          <div className={styles.contactGrid}>
            {(data.emergency_contacts || []).map((contact, index) => (
              <span key={`contact-${index}`} className={styles.contactButton}>{contact}</span>
            ))}
            {!data.emergency_contacts?.length && (
              <span className={styles.contactButton}>등록된 연락처가 없습니다.</span>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
