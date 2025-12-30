import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../api/auth';
import { fetchSafetyGuide } from '../../api/safetyGuide';
import type { SafetyGuideRequest } from '../../types/safetyGuide';
import aiFilesIcon from '../../assets/ai-files.png';
import secureShieldIcon from '../../assets/secure-shield.png';
import styles from './TrainingWeb.module.css';

export const TrainingWeb = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSafetyGuideClick = async () => {
    if (isLoading) {
      return;
    }
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
        date: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
        data_type: 'tideObs',
        station_data_type: 'ObsServiceObj',
      };

      const response = await fetchSafetyGuide(request);
      if (response.success) {
        sessionStorage.setItem('safetyGuideData', JSON.stringify(response.data));
        navigate('/safety-guide');
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
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚓</span>
          <span className={styles.logoText}>해요</span>
        </div>
        <nav className={styles.nav}>
          <button className={styles.navItem} onClick={() => navigate('/home')}>지도</button>
          <button className={styles.navItem}>커뮤니티</button>
          <button className={`${styles.navItem} ${styles.active}`}>학습</button>
          <button className={styles.navItem} onClick={() => navigate('/profile')}>프로필</button>
          <span className={styles.username}>{user?.userId || '???'}님</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Scenario Generation Card */}
        <div className={styles.card} onClick={() => navigate('/scenario/create')}>
          <div className={styles.cardIconWrapper}>
            <img src={aiFilesIcon} alt="AI Files" className={styles.cardIcon} />
          </div>
          <h2 className={styles.cardTitle}>시나리오 생성</h2>
        </div>

        {/* Safety Guide Card */}
        <div className={styles.card} onClick={handleSafetyGuideClick}>
          <div className={styles.cardIconWrapper}>
            <img src={secureShieldIcon} alt="Secure Shield" className={styles.cardIcon} />
          </div>
          <h2 className={styles.cardTitle}>안전 가이드</h2>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className={styles.fab}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

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
