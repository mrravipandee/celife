import { create } from "zustand";

interface UiState {
  isMenuOpen: boolean;
  isContactModalOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  openContactModal: () => void;
  closeContactModal: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isMenuOpen: false,
  isContactModalOpen: false,
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  openContactModal: () => set({ isContactModalOpen: true }),
  closeContactModal: () => set({ isContactModalOpen: false }),
}));
