import React, { useContext } from 'react';
import styles from './NavBar.module.css';
import { RiTranslate, RiGithubFill, RiMoonLine, RiSunLine } from '../SvgIcons';
import { ThemeContext } from '../ThemeProvider';

const NavBar: React.FC = () => {
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

export default NavBar;
