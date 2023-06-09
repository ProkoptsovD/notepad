import { useState, useEffect, useCallback, memo } from 'react';
import styles from './searchBox.module.css';

/**
 * @param {{
 *  onSearchChange: (searchValue: string) => void;
 *  placeholder?: string;
 *  Icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>;
 *  [x: string]: unknown;
 * }} props
 * @returns JSX.Element
 */
export const SearchBox = memo(({ onSearchChange, placeholder, Icon, ...restProps }) => {
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
});
