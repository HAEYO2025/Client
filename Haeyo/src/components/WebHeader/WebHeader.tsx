import { useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, logout } from '../../api/auth';
import styles from './WebHeader.module.css';

type ActivePage = 'home' | 'community' | 'training' | 'profile';

interface WebHeaderProps {
  activePage?: ActivePage;
  onLogout?: () => void;
}

export const WebHeader = ({ activePage, onLogout }: WebHeaderProps) => {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();
  const currentUser = getCurrentUser();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      if (onLogout) {
        onLogout();
      }
      navigate('/home');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => handleNavigation('/home')}>
        <img src="/logo.png" alt="Haeyo Logo" className={styles.anchorIcon} />
        <span className={styles.logoText}>해요</span>
      </div>
      <nav className={styles.navMenu}>
        <button 
          className={`${styles.navItem} ${activePage === 'home' ? styles.active : ''}`}
          onClick={() => handleNavigation('/home')}
        >
          지도
        </button>
        <button 
          className={`${styles.navItem} ${activePage === 'community' ? styles.active : ''}`}
          onClick={() => handleNavigation('/community')}
        >
          커뮤니티
        </button>
        <button 
          className={`${styles.navItem} ${activePage === 'training' ? styles.active : ''}`}
          onClick={() => handleNavigation('/training')}
        >
          학습
        </button>
        <button 
          className={`${styles.navItem} ${activePage === 'profile' ? styles.active : ''}`}
          onClick={() => handleNavigation('/profile')}
        >
          프로필
        </button>
        {isLoggedIn && currentUser ? (
          <>
            <span className={styles.userName}>{currentUser.username}님</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>로그아웃</button>
          </>
        ) : (
          <>
            <button className={styles.navBtn} onClick={() => handleNavigation('/login')}>로그인</button>
            <button className={styles.navBtn} onClick={() => handleNavigation('/signup')}>회원 가입</button>
          </>
        )}
      </nav>
    </header>
  );
};
