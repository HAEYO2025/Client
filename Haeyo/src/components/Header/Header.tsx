import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.icon}>⚓</span>
        <span className={styles.text}>해요</span>
      </div>
    </header>
  );
};
