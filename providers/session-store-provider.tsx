'use client';

import { type ReactNode, createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createSessionStore, type SessionStore, defaultInitState } from '@/stores/session-store';

type SessionStoreApi = ReturnType<typeof createSessionStore>;

const SessionStoreContext = createContext<SessionStoreApi | undefined>(undefined);

export function SessionStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<SessionStoreApi>(undefined);
  if (!storeRef.current) {
    storeRef.current = createSessionStore(defaultInitState);
  }
  return <SessionStoreContext.Provider value={storeRef.current}>{children}</SessionStoreContext.Provider>;
}

export function useSessionStore<T>(selector: (state: SessionStore) => T): T {
  const store = useContext(SessionStoreContext);
  if (!store) {
    throw new Error('useSessionStore must be used within SessionStoreProvider');
  }
  return useStore(store, selector);
}
