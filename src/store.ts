import { create } from 'zustand';

interface AppState {
  activeTab: 'dashboard' | 'inventory' | 'work-order' | 'history';
  setActiveTab: (tab: 'dashboard' | 'inventory' | 'work-order' | 'history') => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
