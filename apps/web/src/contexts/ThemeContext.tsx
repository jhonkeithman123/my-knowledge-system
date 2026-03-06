"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");

  // Get system preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Apply theme to document
  const applyTheme = (newTheme: ResolvedTheme) => {
    const root = document.documentElement;

    // Force remove dark class
    root.classList.remove("dark");

    // Add dark class only if dark theme
    if (newTheme === "dark") {
      root.classList.add("dark");
    }

    // Debug logging
    console.log("🎨 Theme applied:", {
      requestedTheme: newTheme,
      htmlClasses: root.className,
      hasDarkClass: root.classList.contains("dark"),
    });

    setResolvedTheme(newTheme);
  };

  // Initialize theme on mount - runs once
  useEffect(() => {
    const savedTheme = (localStorage.getItem("theme") as ThemeMode) || "system";
    console.log("🔧 Initializing theme from localStorage:", savedTheme);

    setThemeState(savedTheme);

    const resolved =
      savedTheme === "system"
        ? getSystemTheme()
        : (savedTheme as ResolvedTheme);

    console.log("🔍 Resolved theme:", resolved);
    applyTheme(resolved);
  }, []);

  // Update theme when it changes
  useEffect(() => {
    const resolved =
      theme === "system" ? getSystemTheme() : (theme as ResolvedTheme);

    console.log("🔄 Theme changed:", { theme, resolved });
    applyTheme(resolved);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const systemTheme = getSystemTheme();
      console.log("💻 System theme changed:", systemTheme);
      applyTheme(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeMode) => {
    console.log("👆 User set theme:", newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
