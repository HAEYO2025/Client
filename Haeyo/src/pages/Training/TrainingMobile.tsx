import { useNavigate } from 'react-router-dom';
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
          <div className={styles.card}>
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
