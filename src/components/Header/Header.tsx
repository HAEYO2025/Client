import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Haeyo Logo" className={styles.icon} />
        <span className={styles.text}>해요</span>
      </div>
    </header>
  );
};
