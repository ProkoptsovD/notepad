import styles from './header.module.css';

export function Header({ ActionBoxComponent, SearchBoxComponent }) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <div className={styles.actionBoxContainer}>
          <ActionBoxComponent />
        </div>
        <div className={styles.searchBoxContainer}>
          <SearchBoxComponent />
        </div>
      </div>
    </header>
  );
}
