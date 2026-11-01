// Виконує асинхронну функцію при зміні deps і керує станом { data, loading, error }.
// Попередні дані зберігаються під час повторного завантаження (без «блимання» інтерфейсу).
import { useCallback, useEffect, useState } from 'react';

export function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    asyncFn()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((error) => { if (!cancelled) setState((prev) => ({ data: prev.data, loading: false, error })); });
    return () => { cancelled = true; }; // ігноруємо застарілі відповіді
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}
