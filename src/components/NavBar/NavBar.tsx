import React from 'react';
import styles from './NavBar.module.css';
import { RiGithubFill, RiMoonLine, RiTranslate2 } from '../SvgIcon';

const NavBar: React.FC = () => {
    return (
        <div className={styles.navBar}>
            <RiTranslate2 className={styles.logo} />
            <div className={styles.links}>
                <RiGithubFill className={styles.link} />
                <RiMoonLine className={styles.link} />
            </div>
        </div>
    );
};

export default NavBar;
