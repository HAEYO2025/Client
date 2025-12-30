import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../api/auth';
import { fetchRecentReports } from '../../api/reports';
import type { Report } from '../../types/report';
import styles from './HomeWeb.module.css';

export const HomeWeb = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const loadReports = async () => {
      const response = await fetchRecentReports();
      if (response.success) {
        setReports(response.data);
      }
    };
    loadReports();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚓</span>
          <span className={styles.logoText}>해요</span>
        </div>
        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${styles.active}`}>지도</button>
          <button className={styles.navItem}>커뮤니티</button>
          <button className={styles.navItem} onClick={() => navigate('/training')}>학습</button>
          <button className={styles.navItem} onClick={() => navigate('/profile')}>프로필</button>
          <button className={styles.navItem}>로그인</button>
          <button className={styles.navItem}>처음 가입</button>
        </nav>
      </header>

      {/* Main Layout */}
      <div className={styles.mainLayout}>
        {/* Left Sidebar - Recent Reports */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>최근 제보</h2>
            <button className={styles.moreBtn}>더보기</button>
          </div>

          <div className={styles.reportsList}>
            {reports.map((report) => (
              <div key={report.id} className={styles.reportCard}>
                <div className={styles.reportHeader}>
                  <div className={styles.reportAuthor}>
                    <div className={styles.avatar}>{report.author.avatar}</div>
                    <div className={styles.authorInfo}>
                      <span className={styles.authorName}>{report.author.name}</span>
                      <span className={styles.reportTime}>{report.timeAgo}</span>
                    </div>
                  </div>
                </div>
                <p className={styles.reportContent}>{report.content}</p>
                <div className={styles.reportStats}>
                  <span className={styles.stat}>👍 {report.stats.likes}</span>
                  <span className={styles.stat}>💬 {report.stats.comments}</span>
                </div>
              </div>
            ))}

            {/* Safety Notice Card */}
            <div className={styles.noticeCard}>
              <h3 className={styles.noticeTitle}>안전 안내</h3>
              <p className={styles.noticeText}>
                우리 생활과 꼭같은 제보를 보거나 경각,
                수질은 응급하는 국이 더 안전합니다.
              </p>
              <button className={styles.noticeBtn}>간석보 보기</button>
            </div>
          </div>
        </aside>

        {/* Map Area */}
        <main className={styles.mapArea}>
          <button className={styles.filterBtn}>
            <span>▼</span> 필터
          </button>

          <div className={styles.mapContainer}>
            <p className={styles.mapPlaceholder}>Interactive Marine Safety Map</p>
            
            {/* Sample Map Markers */}
            <div className={styles.marker} style={{ top: '15%', right: '20%' }}>11</div>
            <div className={styles.marker} style={{ top: '35%', left: '35%' }}>7</div>
            <div className={styles.marker} style={{ bottom: '35%', left: '45%' }}>12</div>
            <div className={styles.marker} style={{ bottom: '30%', right: '25%' }}>4</div>
          </div>

          {/* Map Controls */}
          <div className={styles.mapControls}>
            <button className={styles.controlBtn}>+</button>
            <button className={styles.controlBtn}>−</button>
            <button className={styles.controlBtn}>⊙</button>
          </div>

          {/* Bottom Action Bar */}
          <div className={styles.actionBar}>
            <button className={styles.actionBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>제보하기</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/scenario/create')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 9L15 15M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>시나리오 생성</span>
            </button>
            <button className={styles.actionBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>안전 가이드</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
