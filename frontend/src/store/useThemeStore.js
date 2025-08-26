import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    // Apply theme immediately when set
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ theme });
  },
}));

// Initialize theme on store creation
const initialTheme = localStorage.getItem("chat-theme") || "coffee";
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', initialTheme);
}