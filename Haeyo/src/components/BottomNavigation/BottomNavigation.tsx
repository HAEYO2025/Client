import { useNavigate } from 'react-router-dom';
import styles from './BottomNavigation.module.css';

type ActivePage = 'map' | 'community' | 'training' | 'profile';

interface BottomNavigationProps {
  activePage: ActivePage;
}

export const BottomNavigation = ({ activePage }: BottomNavigationProps) => {
  const navigate = useNavigate();

  return (
    <nav className={styles.bottomNav}>
      <button 
        className={`${styles.navBtn} ${activePage === 'map' ? styles.active : ''}`}
        onClick={() => navigate('/home')}
      >
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
          <path d="M10 0L12 6H18L13 10L15 16L10 12L5 16L7 10L2 6H8L10 0Z" fill={activePage === 'map' ? '#171717' : '#737373'}/>
        </svg>
        <span>지도</span>
      </button>
      <button 
        className={`${styles.navBtn} ${activePage === 'community' ? styles.active : ''}`}
      >
        <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
          <path d="M16 9C17.66 9 18.99 7.66 18.99 6C18.99 4.34 17.66 3 16 3C14.34 3 13 4.34 13 6C13 7.66 14.34 9 16 9ZM7 9C8.66 9 9.99 7.66 9.99 6C9.99 4.34 8.66 3 7 3C5.34 3 4 4.34 4 6C4 7.66 5.34 9 7 9ZM7 11C4.67 11 0 12.17 0 14.5V17H14V14.5C14 12.17 9.33 11 7 11ZM16 11C15.71 11 15.38 11.02 15.03 11.05C16.19 11.89 17 13.02 17 14.5V17H23V14.5C23 12.17 18.33 11 16 11Z" fill={activePage === 'community' ? '#171717' : '#737373'}/>
        </svg>
        <span>커뮤니티</span>
      </button>
      <button 
        className={`${styles.navBtn} ${activePage === 'training' ? styles.active : ''}`}
        onClick={() => navigate('/training')}
      >
        <svg width="23" height="18" viewBox="0 0 23 18" fill="none">
          <path d="M18 2H14.82C14.4 0.84 13.3 0 12 0C10.7 0 9.6 0.84 9.18 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H18C19.1 18 20 17.1 20 16V4C20 2.9 19.1 2 18 2ZM12 2C12.55 2 13 2.45 13 3C13 3.55 12.55 4 12 4C11.45 4 11 3.55 11 3C11 2.45 11.45 2 12 2ZM14 14H7V12H14V14ZM17 10H7V8H17V10ZM17 6H7V4H17V6Z" fill={activePage === 'training' ? '#171717' : '#737373'}/>
        </svg>
        <span>학습</span>
      </button>
      <button 
        className={`${styles.navBtn} ${activePage === 'profile' ? styles.active : ''}`}
        onClick={() => navigate('/profile')}
      >
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
          <path d="M8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0ZM8 10C5.33 10 0 11.34 0 14V16C0 17.1 0.9 18 2 18H14C15.1 18 16 17.1 16 16V14C16 11.34 10.67 10 8 10Z" fill={activePage === 'profile' ? '#171717' : '#737373'}/>
        </svg>
        <span>프로필</span>
      </button>
    </nav>
  );
};
