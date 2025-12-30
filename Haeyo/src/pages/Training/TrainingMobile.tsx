import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSafetyGuide } from '../../api/safetyGuide';
import type { SafetyGuideRequest } from '../../types/safetyGuide';
import { BottomNavigation } from '../../components/BottomNavigation';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import menuIcon from '../../assets/menu-icon.svg';
import logoIcon from '../../assets/logo-icon.svg';
import notificationIcon from '../../assets/notification-icon.svg';
import aiFilesIcon from '../../assets/ai-files.png';
import secureShieldIcon from '../../assets/secure-shield.png';
import plusIcon from '../../assets/plus-icon.svg';
import styles from './TrainingMobile.module.css';

export const TrainingMobile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSafetyGuideClick = async () => {
    if (isLoading) {
      return;
    }
    // 현재 위치 가져오기
    if (!navigator.geolocation) {
      alert('위치 정보를 사용할 수 없습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const request: SafetyGuideRequest = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        date: new Date().toISOString().slice(0, 10).replace(/-/g, ''), // YYYYMMDD 형식
        data_type: 'tideObs',
        station_data_type: 'ObsServiceObj',
      };

      console.log('Fetching safety guide with request:', request);
      const response = await fetchSafetyGuide(request);
      
      if (response.success) {
        console.log('Safety guide data:', response.data);
        navigate('/safety-guide', { state: response.data });
      } else {
        console.error('Failed to fetch safety guide:', response.error);
        alert('안전 가이드 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to get current position:', error);
      alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.menuBtn} onClick={() => navigate('/home')}>
          <img src={menuIcon} alt="Menu" />
        </button>
        <div className={styles.logo}>
          <img src={logoIcon} alt="Logo" className={styles.logoIcon} />
          <span className={styles.logoText}>해요</span>
        </div>
        <button className={styles.notificationBtn}>
          <img src={notificationIcon} alt="Notifications" />
        </button>
      </header>

      {/* Scrollable Content */}
      <div className={styles.scrollContent}>
        {/* Training Cards */}
        <div className={styles.cardsSection}>
          {/* Scenario Generation Card */}
          <div className={styles.card} onClick={() => navigate('/scenario/create')}>
            <div className={styles.cardIcon}>
              <img src={aiFilesIcon} alt="AI Files" className={styles.iconImage} />
            </div>
            <h3 className={styles.cardTitle}>시나리오 생성</h3>
          </div>

          {/* Safety Guide Card */}
          <div className={styles.card} onClick={handleSafetyGuideClick}>
            <div className={styles.cardIcon}>
              <img src={secureShieldIcon} alt="Secure Shield" className={styles.iconImage} />
            </div>
            <h3 className={styles.cardTitle}>안전 가이드</h3>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activePage="training" />

      {/* Floating Action Button */}
      <FloatingActionButton />

      {isLoading && (
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
