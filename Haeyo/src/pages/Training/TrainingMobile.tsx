import { useNavigate } from 'react-router-dom';
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
      <nav className={styles.bottomNav}>
        <button className={styles.navBtn} onClick={() => navigate('/home')}>
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
        <button className={`${styles.navBtn} ${styles.active}`}>
          <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
            <path d="M18 2H14.82C14.4 0.84 13.3 0 12 0C10.7 0 9.6 0.84 9.18 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2ZM12 2C12.55 2 13 2.45 13 3C13 3.55 12.55 4 12 4C11.45 4 11 3.55 11 3C11 2.45 11.45 2 12 2ZM14 14H7V12H14V14ZM17 10H7V8H17V10ZM17 6H7V4H17V6Z" fill="#010101"/>
          </svg>
          <span>학습</span>
        </button>
        <button className={styles.navBtn}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM8 10C5.33 10 0 11.34 0 14V16C0 17.1 0.9 18 2 18H14C15.1 18 16 17.1 16 16V14C16 11.34 10.67 10 8 10Z" fill="#737373"/>
          </svg>
          <span>프로필</span>
        </button>
      </nav>

      {/* Floating Action Button */}
      <button className={styles.fab}>
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <path d="M10 0H8V8H0V10H8V20H10V10H18V8H10V0Z" fill="white"/>
        </svg>
      </button>
    </div>
  );
};
