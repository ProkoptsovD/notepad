import { useState, useEffect, useCallback } from 'react';
import styles from './searchBox.module.css';

export function SearchBox({ onSearchChange, placeholder, Icon, ...restProps }) {
  const [search, setSearch] = useState('');

  const onSearchChangeCallback = useCallback(onSearchChange, [onSearchChange]);

  useEffect(() => {
    onSearchChangeCallback(search);
  }, [search, onSearchChangeCallback]);

  function handleInputChange({ currentTarget }) {
    setSearch(currentTarget.value);
  }

  return (
    <label className={styles.searchBox}>
      <Icon />
      <input
        type="text"
        className={styles.searchInput}
        value={search}
        onChange={handleInputChange}
        placeholder={placeholder ?? 'Search...'}
        {...restProps}
      />
    </label>
  );
}
