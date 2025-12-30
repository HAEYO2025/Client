import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfileData } from '../../api/profile';
import { logout, getCurrentUser } from '../../api/auth';
import type { ProfileData } from '../../types/profile';
import styles from './ProfileWeb.module.css';

export const ProfileWeb = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚓</span>
            <span className={styles.logoText}>해요</span>
          </div>
          <nav className={styles.nav}>
            <button className={styles.navItem} onClick={() => navigate('/home')}>지도</button>
            <button className={styles.navItem}>커뮤니티</button>
            <button className={styles.navItem} onClick={() => navigate('/training')}>학습</button>
            <button className={`${styles.navItem} ${styles.active}`}>프로필</button>
            <span className={styles.username}>{user?.userId || '???'}님</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
          </nav>
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
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚓</span>
            <span className={styles.logoText}>해요</span>
          </div>
          <nav className={styles.nav}>
            <button className={styles.navItem} onClick={() => navigate('/home')}>지도</button>
            <button className={styles.navItem}>커뮤니티</button>
            <button className={styles.navItem} onClick={() => navigate('/training')}>학습</button>
            <button className={`${styles.navItem} ${styles.active}`}>프로필</button>
            <span className={styles.username}>{user?.userId || '???'}님</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
          </nav>
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
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚓</span>
          <span className={styles.logoText}>해요</span>
        </div>
        <nav className={styles.nav}>
          <button className={styles.navItem} onClick={() => navigate('/home')}>지도</button>
          <button className={styles.navItem}>커뮤니티</button>
          <button className={styles.navItem} onClick={() => navigate('/training')}>학습</button>
          <button className={`${styles.navItem} ${styles.active}`}>프로필</button>
          <span className={styles.username}>{user?.userId || '???'}님</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          {/* Profile Header */}
          <div className={styles.profileHeader}>
            <div className={styles.profileInfo}>
              <h1 className={styles.userName}>{profile.name}</h1>
              <p className={styles.userEmail}>{profile.email}</p>
            </div>
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
                <h2>내가 작성한 제보</h2>
                <span className={styles.count}>{recentReports.length}개</span>
              </div>
              <div className={styles.reportsGrid}>
                {recentReports.map((report) => (
                  <div key={report.id} className={styles.reportCard}>
                    <div className={styles.reportHeader}>
                      <span className={styles.reportLocation}>{report.location}</span>
                      <span className={styles.reportTime}>{formatDate(report.createdAt)}</span>
                    </div>
                    <p className={styles.reportContent}>{report.content}</p>
                    <div className={styles.reportStats}>
                      <span className={styles.stat}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 0L9.5 5.5L15 5.5L10.5 9L12 14L8 11L4 14L5.5 9L1 5.5L6.5 5.5L8 0Z" fill="#9ca3af"/>
                        </svg>
                        {report.stats.likes}
                      </span>
                      <span className={styles.stat}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M14 0H2C0.9 0 0 0.9 0 2V10C0 11.1 0.9 12 2 12H12L16 16V2C16 0.9 15.1 0 14 0Z" fill="#9ca3af"/>
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
                <h2>최근 시나리오</h2>
                <span className={styles.count}>{recentScenarios.length}개</span>
              </div>
              <div className={styles.scenariosGrid}>
                {recentScenarios.map((scenario) => (
                  <div 
                    key={scenario.id} 
                    className={styles.scenarioCard}
                    onClick={() => {
                      if (scenario.feedbackData) {
                        navigate('/scenario/feedback', {
                          state: {
                            scenarioTitle: scenario.title,
                            feedbackEntries: scenario.feedbackData.feedbackEntries,
                            survivalRate: scenario.feedbackData.survivalRate,
                          },
                        });
                      }
                    }}
                    style={{ cursor: scenario.feedbackData ? 'pointer' : 'default' }}
                  >
                    <div className={styles.scenarioHeader}>
                      <h3 className={styles.scenarioTitle}>{scenario.title}</h3>
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
      </main>
    </div>
  );
};
