import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Report } from '../../types/report';
import { fetchRecentReports } from '../../api/reports';
import { fetchSafetyGuide } from '../../api/safetyGuide';
import type { SafetyGuideRequest } from '../../types/safetyGuide';
import { BottomNavigation } from '../../components/BottomNavigation';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { Header } from '../../components/Header';
import menuIcon from '../../assets/menu-icon.svg';
import logoIcon from '../../assets/logo-icon.svg';
import notificationIcon from '../../assets/notification-icon.svg';
import styles from './HomeMobile.module.css';

export const HomeMobile = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuideLoading, setIsGuideLoading] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const response = await fetchRecentReports();
        if (response.success) {
          setReports(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  const handleSafetyGuideClick = async () => {
    if (isGuideLoading) {
      return;
    }
    if (!navigator.geolocation) {
      alert('위치 정보를 사용할 수 없습니다.');
      return;
    }

    try {
      setIsGuideLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const request: SafetyGuideRequest = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        date: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
        data_type: 'tideObs',
        station_data_type: 'ObsServiceObj',
      };

      const response = await fetchSafetyGuide(request);
      if (response.success) {
        navigate('/safety-guide', { state: response.data });
      } else {
        console.error('Failed to fetch safety guide:', response.error);
        alert('안전 가이드 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to get current position:', error);
      alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
    } finally {
      setIsGuideLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Header
        variant="main"
        menuIconSrc={menuIcon}
        logoIconSrc={logoIcon}
        notificationIconSrc={notificationIcon}
      />

      {/* Scrollable Content */}
      <div className={styles.scrollContent}>
        {/* Map Section */}
        <div className={styles.mapSection}>
          <div className={styles.mapPlaceholder}>
            <span className={styles.mapText}>Interactive Marine Safety Map</span>
            
            {/* Map markers */}
            <div className={styles.marker} style={{ left: '64px', top: '80px' }}>12</div>
            <div className={styles.marker} style={{ left: '263px', top: '128px' }}>8</div>
            <div className={styles.marker} style={{ left: '48px', top: '388px' }}>5</div>
            
            {/* Filter button */}
            <button className={styles.filterBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5.5 14H8.5V11.67H5.5V14ZM0.5 0V2.33H13.5V0H0.5ZM2.5 8.17H11.5V5.83H2.5V8.17Z" fill="#404040"/>
              </svg>
              <span>필터</span>
            </button>
            
            {/* Map controls */}
            <div className={styles.mapControls}>
              <button className={styles.controlBtn}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="#171717"/>
                </svg>
              </button>
              <button className={styles.controlBtn}>
                <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
                  <path d="M0 0H14V2H0V0Z" fill="#171717"/>
                </svg>
              </button>
              <button className={styles.controlBtn}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 0C5.24 0 3 2.24 3 5C3 8.5 8 15 8 15C8 15 13 8.5 13 5C13 2.24 10.76 0 8 0ZM8 6.5C7.17 6.5 6.5 5.83 6.5 5C6.5 4.17 7.17 3.5 8 3.5C8.83 3.5 9.5 4.17 9.5 5C9.5 5.83 8.83 6.5 8 6.5Z" fill="#171717"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionSection}>
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0L12.5 7.5H20L14 12L16.5 19.5L10 15L3.5 19.5L6 12L0 7.5H7.5L10 0Z" fill="#525252"/>
              </svg>
              <span>제보하기</span>
            </button>
            <button className={styles.actionBtn} onClick={() => navigate('/scenario/create')}>
              <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
                <path d="M12 0H3C1.9 0 1 0.9 1 2V18C1 19.1 1.9 20 3 20H12C13.1 20 14 19.1 14 18V2C14 0.9 13.1 0 12 0ZM7.5 1.5C8.05 1.5 8.5 1.95 8.5 2.5C8.5 3.05 8.05 3.5 7.5 3.5C6.95 3.5 6.5 3.05 6.5 2.5C6.5 1.95 6.95 1.5 7.5 1.5ZM7.5 18.5C6.67 18.5 6 17.83 6 17C6 16.17 6.67 15.5 7.5 15.5C8.33 15.5 9 16.17 9 17C9 17.83 8.33 18.5 7.5 18.5Z" fill="#525252"/>
              </svg>
              <span>시나리오 생성</span>
            </button>
            <button className={styles.actionBtn} onClick={handleSafetyGuideClick}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M9 5H11V11H9V5ZM10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM9 13H11V15H9V13Z" fill="#525252"/>
              </svg>
              <span>안전 가이드</span>
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className={styles.reportsSection}>
          <div className={styles.sectionHeader}>
            <h2>최근 제보</h2>
            <button className={styles.moreBtn}>더보기</button>
          </div>
          
          {isLoading ? (
            <div className={styles.loadingState}>
              <p>제보를 불러오는 중...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className={styles.emptyState}>
              <p>최근 제보가 없습니다.</p>
            </div>
          ) : (
            <div className={styles.reportsList}>
              {reports.map((report) => (
                <div key={report.id} className={styles.reportCard}>
                  <div className={styles.reportContent}>
                    <div className={styles.reportHeader}>
                      <span className={styles.reportTime}>{report.timeAgo}</span>
                    </div>
                    <p className={styles.reportText}>{report.content}</p>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activePage="map" />

      {/* Floating Action Button */}
      <FloatingActionButton />

      {isGuideLoading && (
        <div className={styles.loadingOverlay} role="status" aria-live="polite">
          <div className={styles.loadingCard}>
            <span className={styles.loadingSpinner} aria-hidden="true" />
            <p className={styles.loadingText}>맞춤형 안전 가이드 생성 중...</p>
          </div>
        </div>
      )}
    </div>
  );
};
