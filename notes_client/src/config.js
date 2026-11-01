// Конфігурація клієнта. Значення беруться зі змінних середовища Vite (.env).
export const config = {
  apiUrl: import.meta.env?.VITE_API_URL || '/api',
  requestTimeoutMs: 10000,
  storagePrefix: 'notes-app:',
};
