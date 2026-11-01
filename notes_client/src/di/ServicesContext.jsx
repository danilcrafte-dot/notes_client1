// Передача DI-контейнера в дерево React через Context.
import { createContext, useContext } from 'react';

const ServicesContext = createContext(null);

export function ServicesProvider({ container, children }) {
  return <ServicesContext.Provider value={container}>{children}</ServicesContext.Provider>;
}

/** Повертає сервіс за іменем: const notes = useService('notesService'). */
export function useService(name) {
  const container = useContext(ServicesContext);
  if (!container) throw new Error('useService потрібно використовувати всередині <ServicesProvider>');
  return container.resolve(name);
}
