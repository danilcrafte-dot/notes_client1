// Як useState, але значення зберігається в localStorage через StorageService (DI).
import { useEffect, useState } from 'react';
import { useService } from '../di/ServicesContext.jsx';

export function usePersistentState(key, initialValue) {
  const storage = useService('storage');
  const [value, setValue] = useState(() => storage.get(key, initialValue));
  useEffect(() => { storage.set(key, value); }, [storage, key, value]);
  return [value, setValue];
}
