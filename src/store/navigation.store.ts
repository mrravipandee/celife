import { create } from "zustand";

interface NavigationState {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: "home",
  setActiveSection: (section) => set({ activeSection: section }),
}));
