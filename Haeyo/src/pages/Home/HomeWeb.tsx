import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../api/auth';
import styles from './HomeWeb.module.css';

export const HomeWeb = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.icon}>⚓</span>
          <span className={styles.text}>해요</span>
        </div>
        <nav className={styles.nav}>
          <span className={styles.navItem}>지도</span>
          <span className={styles.navItem}>커뮤니티</span>
          <span className={styles.navItem}>학습</span>
          <span className={styles.navItem}>프로필</span>
        </nav>
        <div className={styles.userSection}>
          <span className={styles.username}>{user?.userId}</span>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          <h1 className={styles.title}>환영합니다!</h1>
          <p className={styles.userInfo}>
            로그인 사용자: <strong>{user?.userId}</strong>
          </p>
          <p className={styles.time}>
            로그인 시간: {user?.loginTime ? new Date(user.loginTime).toLocaleString('ko-KR') : ''}
          </p>
          
          <div className={styles.placeholder}>
            <p>🗺️ 해양 안전 지도</p>
            <p className={styles.comingSoon}>(Coming Soon)</p>
          </div>
        </div>
      </main>
    </div>
  );
};
