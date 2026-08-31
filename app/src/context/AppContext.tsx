import React, { createContext, useState, useContext } from "react";
import { Appearance } from "react-native";

// Light & Dark theme colors
const lightColors = {
  background: "#F5F5F5",
  surface: "#FFFFFF",
  text: "#212121",
  textSecondary: "#757575",
  primary: "#2E7D32",
  primaryDark: "#1B5E20",
  primaryLight: "#4CAF50",
  secondary: "#A27A52",
  accent: "#FFB300",
  border: "#E0E0E0",
  disabled: "#BDBDBD",
  success: "#388E3C",
  warning: "#F57C00",
  error: "#D32F2F",
};

const darkColors = {
  background: "#121212",
  surface: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  primary: "#4CAF50",
  primaryDark: "#2E7D32",
  primaryLight: "#66BB6A",
  secondary: "#C49A6C",
  accent: "#FFD54F",
  border: "#333333",
  disabled: "#666666",
  success: "#66BB6A",
  warning: "#FFB74D",
  error: "#EF5350",
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