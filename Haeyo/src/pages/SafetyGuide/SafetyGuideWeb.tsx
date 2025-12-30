import { useLocation, useNavigate } from 'react-router-dom';
import { SafetyGuideData } from '../../types/safetyGuide';
import styles from './SafetyGuideWeb.module.css';

export const SafetyGuideWeb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as SafetyGuideData;

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

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'safe':
        return '#22c55e';
      case 'caution':
        return '#eab308';
      case 'warning':
        return '#f97316';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'safe':
        return '안전';
      case 'caution':
        return '주의';
      case 'warning':
        return '경고';
      case 'critical':
        return '위험';
      default:
        return '알 수 없음';
    }
  };

  // 최근 24시간 조위 데이터 가져오기
  const tideData = data.ocean_data?.result?.data?.slice(-144) || []; // 24시간 = 1440분 / 10분 = 144개

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>안전 가이드</h1>
        <div className={styles.spacer} />
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Risk Level Card */}
        <div className={styles.riskCard}>
          <div className={styles.riskHeader}>
            <div 
              className={styles.riskBadge}
              style={{ backgroundColor: getRiskLevelColor(data.risk_level) }}
            >
              {getRiskLevelText(data.risk_level)}
            </div>
            <div className={styles.riskScore}>위험도: {data.risk_score}/100</div>
          </div>
          <p className={styles.summary}>{data.summary}</p>
        </div>

        {/* Location & Station Info */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoTitle}>위치 정보</h3>
            <div className={styles.infoContent}>
              <p>위도: {data.location.latitude.toFixed(6)}</p>
              <p>경도: {data.location.longitude.toFixed(6)}</p>
              <p>날짜: {data.date}</p>
            </div>
          </div>

          {data.station_info && (
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>관측소 정보</h3>
              <div className={styles.infoContent}>
                <p>이름: {data.station_info.obs_name}</p>
                <p>코드: {data.station_info.obs_code}</p>
                <p>거리: {data.station_info.distance_km.toFixed(2)} km</p>
              </div>
            </div>
          )}
        </div>

        {/* Warnings */}
        {data.warnings && data.warnings.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>⚠️ 경고사항</h2>
            <ul className={styles.warningList}>
              {data.warnings.map((warning, index) => (
                <li key={index} className={styles.warningItem}>{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations && data.recommendations.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>💡 권장사항</h2>
            <ul className={styles.recommendationList}>
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className={styles.recommendationItem}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Emergency Contacts */}
        {data.emergency_contacts && data.emergency_contacts.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🚨 긴급 연락처</h2>
            <div className={styles.contactGrid}>
              {data.emergency_contacts.map((contact, index) => (
                <a key={index} href={`tel:${contact}`} className={styles.contactButton}>
                  {contact}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tide Data Chart */}
        {tideData.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>📊 조위 데이터 (최근 24시간)</h2>
            <div className={styles.chartContainer}>
              <svg className={styles.chart} viewBox="0 0 1000 300" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={`grid-${i}`}
                    x1="0"
                    y1={i * 60}
                    x2="1000"
                    y2={i * 60}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}
                
                {/* Tide level line */}
                <polyline
                  points={tideData.map((item, i) => {
                    const x = (i / (tideData.length - 1)) * 1000;
                    const maxLevel = Math.max(...tideData.map(d => parseInt(d.tide_level)));
                    const minLevel = Math.min(...tideData.map(d => parseInt(d.tide_level)));
                    const range = maxLevel - minLevel || 1;
                    const y = 240 - ((parseInt(item.tide_level) - minLevel) / range) * 200;
                    return `${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#0a7a7e"
                  strokeWidth="2"
                />
              </svg>
              <div className={styles.chartLegend}>
                <span>시작: {tideData[0]?.record_time}</span>
                <span>종료: {tideData[tideData.length - 1]?.record_time}</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
