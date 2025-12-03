import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@app_theme");
        if (savedTheme === "Light" || savedTheme === "Dark" || savedTheme === "System") {
          setThemeState(savedTheme === "Light" ? "light" : savedTheme === "Dark" ? "dark" : "system");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (theme === "system") {
      setActualTheme(systemTheme === "dark" ? "dark" : "light");
    } else {
      setActualTheme(theme);
    }
  }, [theme, systemTheme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      const themeString = newTheme === "light" ? "Light" : newTheme === "dark" ? "Dark" : "System";
      await AsyncStorage.setItem("@app_theme", themeString);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

