import { createContext, useContext, useState, ReactNode } from "react";
import { themes, Theme } from "../lib/themes";
type ThemeContextType = {
  theme: Theme;
  setTheme: (T:Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
    const defaultTheme: any = themes[0] || {
    name: 'default',
    primary: '#000',
    secondary: '#fff',
    background: '#fff',
    text: '#000',
  };
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}

