import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfileData } from '../../api/profile';
import type { ProfileData } from '../../types/profile';
import styles from './ProfileMobile.module.css';

export const ProfileMobile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reports' | 'scenarios'>('reports');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetchProfileData();
        if (response.success) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
    
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M15 9H1M1 9L8 16M1 9L8 2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className={styles.title}>프로필</h1>
        </header>
        <div className={styles.loadingState}>
          <p>프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
              <path d="M15 9H1M1 9L8 16M1 9L8 2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className={styles.title}>프로필</h1>
        </header>
        <div className={styles.errorState}>
          <p>프로필을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const { profile, recentReports, recentScenarios } = profileData;

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M15 9H1M1 9L8 16M1 9L8 2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>프로필</h1>
      </header>

      {/* Scrollable Content */}
      <div className={styles.scrollContent}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>{profile.avatar || '👤'}</div>
          </div>
          <h2 className={styles.userName}>{profile.name}</h2>
          <p className={styles.userEmail}>{profile.email}</p>
          
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{profile.stats.reportsCount}</span>
              <span className={styles.statLabel}>제보</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statValue}>{profile.stats.scenariosCount}</span>
              <span className={styles.statLabel}>시나리오</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${activeTab === 'reports' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            내 제보
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'scenarios' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('scenarios')}
          >
            시나리오 기록
          </button>
        </div>

        {/* Content */}
        {activeTab === 'reports' ? (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h3>내가 작성한 제보</h3>
              <span className={styles.count}>{recentReports.length}개</span>
            </div>
            <div className={styles.reportsList}>
              {recentReports.map((report) => (
                <div key={report.id} className={styles.reportCard}>
                  <div className={styles.reportHeader}>
                    <span className={styles.reportLocation}>{report.location}</span>
                    <span className={styles.reportTime}>{formatDate(report.createdAt)}</span>
                  </div>
                  <p className={styles.reportContent}>{report.content}</p>
                  <div className={styles.reportStats}>
                    <span className={styles.stat}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 0L7.5 4.5L12 4.5L8.5 7.5L10 12L6 9L2 12L3.5 7.5L0 4.5L4.5 4.5L6 0Z" fill="#737373"/>
                      </svg>
                      {report.stats.likes}
                    </span>
                    <span className={styles.stat}>
                      <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
                        <path d="M10.5 0H1.5C0.675 0 0 0.675 0 1.5V7.5C0 8.325 0.675 9 1.5 9H9L12 12V1.5C12 0.675 11.325 0 10.5 0Z" fill="#737373"/>
                      </svg>
                      {report.stats.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h3>최근 시나리오</h3>
              <span className={styles.count}>{recentScenarios.length}개</span>
            </div>
            <div className={styles.scenariosList}>
              {recentScenarios.map((scenario) => (
                <div key={scenario.id} className={styles.scenarioCard}>
                  <div className={styles.scenarioHeader}>
                    <h4 className={styles.scenarioTitle}>{scenario.title}</h4>
                    <span className={styles.scenarioTime}>{formatDate(scenario.createdAt)}</span>
                  </div>
                  <p className={styles.scenarioDescription}>{scenario.description}</p>
                  <div className={styles.scenarioFooter}>
                    <div className={styles.survivalRate}>
                      <span className={styles.survivalLabel}>생존율</span>
                      <span className={`${styles.survivalValue} ${scenario.survivalRate >= 70 ? styles.survivalGood : styles.survivalBad}`}>
                        {scenario.survivalRate}%
                      </span>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[scenario.status]}`}>
                      {scenario.status === 'completed' ? '완료' : '진행 중'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button className={styles.navBtn} onClick={() => navigate('/')}>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M10 0L12 6H18L13 10L15 16L10 12L5 16L7 10L2 6H8L10 0Z" fill="#737373"/>
          </svg>
          <span>지도</span>
        </button>
        <button className={styles.navBtn}>
          <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
            <path d="M16 9C17.66 9 18.99 7.66 18.99 6C18.99 4.34 17.66 3 16 3C14.34 3 13 4.34 13 6C13 7.66 14.34 9 16 9ZM7 9C8.66 9 9.99 7.66 9.99 6C9.99 4.34 8.66 3 7 3C5.34 3 4 4.34 4 6C4 7.66 5.34 9 7 9ZM7 11C4.67 11 0 12.17 0 14.5V17H14V14.5C14 12.17 9.33 11 7 11ZM16 11C15.71 11 15.38 11.02 15.03 11.05C16.19 11.89 17 13.02 17 14.5V17H23V14.5C23 12.17 18.33 11 16 11Z" fill="#737373"/>
          </svg>
          <span>커뮤니티</span>
        </button>
        <button className={styles.navBtn} onClick={() => navigate('/training')}>
          <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
            <path d="M18 2H14.82C14.4 0.84 13.3 0 12 0C10.7 0 9.6 0.84 9.18 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2ZM12 2C12.55 2 13 2.45 13 3C13 3.55 12.55 4 12 4C11.45 4 11 3.55 11 3C11 2.45 11.45 2 12 2ZM14 14H7V12H14V14ZM17 10H7V8H17V10ZM17 6H7V4H17V6Z" fill="#737373"/>
          </svg>
          <span>학습</span>
        </button>
        <button className={`${styles.navBtn} ${styles.active}`}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM8 10C5.33 10 0 11.34 0 14V16C0 17.1 0.9 18 2 18H14C15.1 18 16 17.1 16 16V14C16 11.34 10.67 10 8 10Z" fill="#171717"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>
    </div>
  );
};
