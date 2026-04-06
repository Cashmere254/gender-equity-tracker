// frontend/src/hooks/useFetch.js

import { useState, useEffect } from 'react';

/**
 * Generic data-fetching hook.
 * Manages loading, error, and data states consistently across all pages.
 *
 * Usage:
 * const { data: programs, loading, error } = useFetch(getPrograms);
 * const { data, loading } = useFetch(() => getKPISummary(programId), [programId]);
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false; // prevents state update on unmounted component

    setLoading(true);
    setError(null);

    fetchFn()
      .then((res) => { if (!cancelled) setData(res.data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Something went wrong'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; }; // cleanup on unmount

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}