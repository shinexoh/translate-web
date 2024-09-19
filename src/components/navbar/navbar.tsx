import React, { useContext } from 'react';
import styles from './navbar.module.css';
import { RiTranslate, RiGithubFill, RiMoonLine, RiSunLine } from '../svg-icons';
import { ThemeContext } from '../theme-provider';

const Navbar: React.FC = () => {
    const themeContext = useContext(ThemeContext);

    if (!themeContext) {
        throw new Error('ThemeContext is not provided');
    }

    const { theme, toggleTheme } = themeContext;

    const toGithub = () => window.open('https://github.com/shinexoh/translate-web', '_blank');

    return (
        <div className={styles.navBar}>
            <RiTranslate className={styles.logo} />
            <div className={styles.links}>
                <button onClick={toGithub}>
                    <RiGithubFill className={styles.link} />
                </button>
                <button onClick={toggleTheme}>
                    {theme === 'light'
                        ? <RiMoonLine className={styles.link} />
                        : <RiSunLine className={styles.link} />}
                </button>
            </div>
        </div>
    );
};

export default Navbar;
