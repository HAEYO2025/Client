import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfileData } from '../../api/profile';
import type { ProfileData } from '../../types/profile';
import { BottomNavigation } from '../../components/BottomNavigation';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
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
        <Header variant="page" title="프로필" />
        <div className={styles.loadingState}>
          <p>프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className={styles.container}>
        <Header variant="page" title="프로필" />
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
      <Header variant="page" title="프로필" />

      {/* Scrollable Content */}
      <div className={styles.scrollContent}>
        {/* Profile Section */}
        <div className={styles.profileSection}>
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
      <BottomNavigation activePage="profile" />

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};
