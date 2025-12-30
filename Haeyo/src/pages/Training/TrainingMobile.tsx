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

  const handleSafetyGuideClick = async () => {
    // 현재 위치 기준으로 안전 가이드 조회 (예시 좌표)
    const request: SafetyGuideRequest = {
      latitude: 37.5665,
      longitude: 126.978,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, ''), // YYYYMMDD 형식
      data_type: 'tideObs',
      station_data_type: 'ObsServiceObj',
    };

    console.log('Fetching safety guide with request:', request);
    const response = await fetchSafetyGuide(request);
    
    if (response.success) {
      console.log('Safety guide data:', response.data);
      // TODO: 안전 가이드 결과 페이지로 이동하거나 모달 표시
      // navigate('/safety-guide', { state: response.data });
    } else {
      console.error('Failed to fetch safety guide:', response.error);
      alert('안전 가이드 정보를 불러오는데 실패했습니다.');
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
    </div>
  );
};
