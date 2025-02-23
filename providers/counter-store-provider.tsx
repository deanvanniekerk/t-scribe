'use client';

import { type ReactNode, createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { type ProcessStore, createProcessStore } from '@/stores/process-store';

export type ProcessStoreApi = ReturnType<typeof createProcessStore>;

export const ProcessStoreContext = createContext<ProcessStoreApi | undefined>(undefined);

export interface ProcessStoreProviderProps {
  children: ReactNode;
}

export const ProcessStoreProvider = ({ children }: ProcessStoreProviderProps) => {
  const storeRef = useRef<ProcessStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createProcessStore();
  }

  return <ProcessStoreContext.Provider value={storeRef.current}>{children}</ProcessStoreContext.Provider>;
};

export const useProcessStore = <T,>(selector: (store: ProcessStore) => T): T => {
  const processStoreContext = useContext(ProcessStoreContext);

  if (!processStoreContext) {
    throw new Error('useProcessStore must be used within ProcessStoreProvider');
  }

  return useStore(processStoreContext, selector);
};
