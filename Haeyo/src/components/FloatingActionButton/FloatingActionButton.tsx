import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './FloatingActionButton.module.css';

export const FloatingActionButton = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Floating Action Menu */}
      {isMenuOpen && (
        <div className={styles.fabMenuContainer}>
          <div className={styles.fabMenuBackground}>
            <button 
              className={styles.fabMenuItem}
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/scenario/create');
              }}
              title="시나리오"
            >
              <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
                <path d="M12 0H3C1.9 0 1 0.9 1 2V18C1 19.1 1.9 20 3 20H12C13.1 20 14 19.1 14 18V2C14 0.9 13.1 0 12 0ZM7.5 1.5C8.05 1.5 8.5 1.95 8.5 2.5C8.5 3.05 8.05 3.5 7.5 3.5C6.95 3.5 6.5 3.05 6.5 2.5C6.5 1.95 6.95 1.5 7.5 1.5ZM7.5 18.5C6.67 18.5 6 17.83 6 17C6 16.17 6.67 15.5 7.5 15.5C8.33 15.5 9 16.17 9 17C9 17.83 8.33 18.5 7.5 18.5Z" fill="#171717"/>
              </svg>
              <span className={styles.fabMenuLabel}>시나리오</span>
            </button>
            <button 
              className={styles.fabMenuItem}
              onClick={() => setIsMenuOpen(false)}
              title="제보하기"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0L12.5 7.5H20L14 12L16.5 19.5L10 15L3.5 19.5L6 12L0 7.5H7.5L10 0Z" fill="#171717"/>
              </svg>
              <span className={styles.fabMenuLabel}>제보하기</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Floating Action Button */}
      <button 
        className={`${styles.fab} ${isMenuOpen ? styles.fabOpen : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <svg 
          width="18" 
          height="20" 
          viewBox="0 0 18 20" 
          fill="none"
          className={styles.fabIcon}
        >
          <path d="M10 0H8V8H0V10H8V20H10V10H18V8H10V0Z" fill="white"/>
        </svg>
      </button>
    </>
  );
};
