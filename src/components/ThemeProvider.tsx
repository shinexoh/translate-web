import React, { createContext, useEffect, useState } from 'react';
import faviconLight from '../assets/favicon.svg';
import faviconDark from '../assets/favicon-dark.svg';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('light');

    // 首次加载获取主题
    const initialTheme = () => {
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            document.documentElement.className = savedTheme;
            setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDark ? 'dark' : 'light';
            document.documentElement.className = theme;
            setTheme(theme);
        }
    };

    // 监听系统主题变化，如果存在 localStorage 则不监听
    const listenSystemThemeChange = () => {
        if (localStorage.getItem('theme')) {
            return;
        }
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.onchange = (event: MediaQueryListEvent) => {
            if (localStorage.getItem('theme')) return;
            const newTheme = event.matches ? 'dark' : 'light';
            document.documentElement.className = newTheme;
            setTheme(newTheme);
        };
    };

    // 网页加载完成后设置 favicon 并监听系统主题变化时更新 favicon
    const setAndListenFavicon = () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]')!;
        if (mediaQuery.matches) {
            favicon.href = faviconDark;
        }
        mediaQuery.onchange = (event: MediaQueryListEvent) => {
            favicon.href = event.matches ? faviconDark : faviconLight;
        };
    };

    useEffect(() => {
        initialTheme();
        listenSystemThemeChange();
        setAndListenFavicon();
    }, []);

    // 点击切换主题
    const toggleTheme = () => {
        const currentTheme = document.documentElement.className;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        document.documentElement.className = newTheme;
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };
