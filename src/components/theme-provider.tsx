import React, { createContext, useEffect, useState } from 'react';
import faviconLight from '../assets/favicon.svg';
import faviconDark from '../assets/favicon-dark.svg';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme } from '../themes';

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
            setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
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
            setTheme(event.matches ? 'dark' : 'light');
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
        const newTheme = theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    const currentTheme = theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
            <EmotionThemeProvider theme={currentTheme}>
                {children}
            </EmotionThemeProvider>
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
export { ThemeContext };
