import React, { createContext, useState, useContext } from "react";
import { Appearance } from "react-native";

// Light & Dark theme colors
const lightColors = {
  background: "#ffffff",
  surface: "#f5f5f5",
  text: "#000000",
  textSecondary: "#555555",
  primary: "#0a84ff",
  error: "#ff3b30",
};

const darkColors = {
  background: "#121212",
  surface: "#1e1e1e",
  text: "#ffffff",
  textSecondary: "#aaaaaa",
  primary: "#0a84ff",
  error: "#ff453a",
};

type LanguageType = "hi" | "en";
type ThemeType = "light" | "dark";

interface AppContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: typeof lightColors;
}

const AppContext = createContext<AppContextType>({
  language: "hi",
  setLanguage: () => {},
  theme: "light",
  setTheme: () => {},
  colors: lightColors,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Default theme based on system
  const systemTheme = Appearance.getColorScheme() === "dark" ? "dark" : "light";

  const [language, setLanguage] = useState<LanguageType>("hi");
  const [theme, setTheme] = useState<ThemeType>(systemTheme);

  const colors = theme === "light" ? lightColors : darkColors;

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, colors }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}