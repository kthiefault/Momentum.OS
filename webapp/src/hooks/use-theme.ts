import { useState, useEffect } from "react";

export type Theme = "dark" | "light";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // One-time migration: reset any stale "light" setting back to dark
    if (!localStorage.getItem("theme-v2")) {
      localStorage.setItem("theme", "dark");
      localStorage.setItem("theme-v2", "1");
    }
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved === "light" ? "light" : "dark";
  });

  const [hasChosen, setHasChosen] = useState<boolean>(
    () => localStorage.getItem("theme-chosen") === "true"
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const chooseTheme = (t: Theme) => {
    setThemeState(t);
    setHasChosen(true);
    localStorage.setItem("theme-chosen", "true");
    localStorage.setItem("theme", t);
  };

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    chooseTheme(next);
  };

  return { theme, hasChosen, chooseTheme, toggleTheme };
}
