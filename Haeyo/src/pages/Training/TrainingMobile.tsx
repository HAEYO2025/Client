import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '../../components/BottomNavigation';
import styles from './TrainingMobile.module.css';

export const TrainingMobile = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <button className={styles.menuBtn} onClick={() => navigate('/home')}>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M17 9L9 1L1 9" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 11L9 19L1 11" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.logo}>
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M10 0L12 6H18L13 10L15 16L10 12L5 16L7 10L2 6H8L10 0Z" fill="#171717"/>
          </svg>
          <span className={styles.logoText}>해요</span>
        </div>
        <button className={styles.notificationBtn}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M8 18C9.1 18 10 17.1 10 16H6C6 17.1 6.9 18 8 18ZM14 12V7.5C14 4.93 12.37 2.77 10 2.21V1.5C10 0.67 9.33 0 8.5 0C7.67 0 7 0.67 7 1.5V2.21C4.64 2.77 3 4.92 3 7.5V12L1 14V15H16V14L14 12Z" fill="#171717"/>
          </svg>
        </button>
      </header>

      {/* Scrollable Content */}
      <div className={styles.scrollContent}>
        {/* Training Cards */}
        <div className={styles.cardsSection}>
          {/* Scenario Generation Card */}
          <div className={styles.card} onClick={() => navigate('/scenario/create')}>
            <div className={styles.cardIcon}>
              <svg width="106" height="106" viewBox="0 0 106 106" fill="none">
                <rect width="106" height="106" rx="8" fill="#F5F5F5"/>
                <path d="M53 30L58 45H73L61 54L66 69L53 60L40 69L45 54L33 45H48L53 30Z" fill="#F59E0B"/>
                <rect x="45" y="55" width="16" height="4" rx="2" fill="#F59E0B"/>
                <rect x="45" y="62" width="16" height="4" rx="2" fill="#F59E0B"/>
                <rect x="45" y="69" width="12" height="4" rx="2" fill="#F59E0B"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>시나리오 생성</h3>
          </div>

          {/* Safety Guide Card */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="118" height="118" viewBox="0 0 118 118" fill="none">
                <rect width="118" height="118" rx="8" fill="#F5F5F5"/>
                <path d="M59 25L45 32V48C45 62 52 75 59 78C66 75 73 62 73 48V32L59 25Z" fill="#3B82F6"/>
                <path d="M59 25L45 32V48C45 62 52 75 59 78V25Z" fill="#1E40AF"/>
                <path d="M54 55L51 52L48 55L54 61L70 45L67 42L54 55Z" fill="#FCD34D"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>안전 가이드</h3>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activePage="training" />

      {/* Floating Action Button */}
      <button className={styles.fab}>
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <path d="M10 0H8V8H0V10H8V20H10V10H18V8H10V0Z" fill="white"/>
        </svg>
      </button>
    </div>
  );
};
