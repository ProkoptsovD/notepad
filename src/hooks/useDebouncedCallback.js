import { useRef, useCallback } from 'react';

export function useDebouncedCallback(callback, delay) {
  const timeout = useRef();

  return useCallback(
    (...args) => {
      const later = () => {
        clearTimeout(timeout.current);
        callback(...args);
      };

      clearTimeout(timeout.current);
      timeout.current = setTimeout(later, delay);
    },
    [callback, delay]
  );
}
