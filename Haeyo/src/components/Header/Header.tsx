import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

type HeaderVariant = 'main' | 'page';

interface HeaderProps {
  variant?: HeaderVariant;
  title?: string;
  onBack?: () => void;
  onMenuClick?: () => void;
  onNotificationClick?: () => void;
  menuIconSrc?: string;
  logoIconSrc?: string;
  notificationIconSrc?: string;
}

export const Header = ({ 
  variant = 'main', 
  title,
  onBack,
  onMenuClick,
  onNotificationClick,
  menuIconSrc,
  logoIconSrc,
  notificationIconSrc,
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  if (variant === 'page') {
    return (
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M15 9H1M1 9L8 16M1 9L8 2" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className={styles.title}>{title || ''}</h1>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onMenuClick}>
        {menuIconSrc ? (
          <img src={menuIconSrc} alt="Menu" className={styles.menuIcon} />
        ) : (
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
            <path d="M0 0H18V2H0V0ZM0 5H18V7H0V5ZM0 10H18V12H0V10Z" fill="#171717"/>
          </svg>
        )}
      </button>
      <div className={styles.logo}>
<<<<<<< HEAD
        <img src="/logo.png" alt="Haeyo Logo" className={styles.icon} />
        <span className={styles.text}>해요</span>
=======
        {logoIconSrc ? (
          <img src={logoIconSrc} alt="Logo" className={styles.logoIcon} />
        ) : (
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path d="M10 0L12 6H18L13 10L15 16L10 12L5 16L7 10L2 6H8L10 0Z" fill="#171717"/>
          </svg>
        )}
        <span className={styles.logoText}>해요</span>
>>>>>>> master
      </div>
      <button className={styles.notificationBtn} onClick={onNotificationClick}>
        {notificationIconSrc ? (
          <img src={notificationIconSrc} alt="Notifications" className={styles.notificationIcon} />
        ) : (
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M8 18C9.1 18 10 17.1 10 16H6C6 17.1 6.9 18 8 18ZM14 12V7.5C14 4.93 12.37 2.77 10 2.21V1.5C10 0.67 9.33 0 8.5 0C7.67 0 7 0.67 7 1.5V2.21C4.64 2.77 3 4.92 3 7.5V12L1 14V15H16V14L14 12Z" fill="#171717"/>
          </svg>
        )}
      </button>
    </header>
  );
};
