import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("conversely-theme") || "light", // or "dark"
  setTheme: (theme) => {
    localStorage.setItem("conversely-theme", theme);
    set({ theme });
  },
}));
