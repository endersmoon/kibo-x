import { useEffect, useState } from 'react';

/**
 * Hook to detect when JavaScript has loaded and the component is mounted on the client side.
 * This is useful for avoiding hydration mismatches with components that use browser-only APIs.
 */
export function useJsLoaded() {
  const [jsLoaded, setJsLoaded] = useState(false);

  useEffect(() => {
    setJsLoaded(true);
  }, []);

  return jsLoaded;
}
