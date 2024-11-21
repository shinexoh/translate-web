/** @jsxImportSource @emotion/react */

import { css, type Theme } from '@emotion/react';
import React, { useContext } from 'react';
import { RiGithubFill, RiMoonLine, RiSunLine, RiTranslate } from './svg-icons';
import { ThemeContext } from './theme-provider';

const styles = {
  wrapper: (theme: Theme) => css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '25px 30px',
    backgroundColor: theme.colors.primaryColor,
    borderBottom: `1px solid ${theme.colors.borderColor}`,

    '@media (max-width: 768px)': {
      padding: '20px',
    },
  }),

  logo: (theme: Theme) => css({
    fontSize: '1.6rem',
    color: theme.colors.iconColor,
    cursor: 'pointer',

    '&:hover': {
      color: theme.colors.iconHoverColor,
    },
  }),

  links: css({
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  }),

  linksButton: css({
    display: 'flex',
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  }),

  link: (theme: Theme) => css({
    fontSize: '1.5rem',
    color: theme.colors.iconColor,

    '&:hover': {
      color: theme.colors.iconHoverColor,
    },
  }),
};

const Navbar: React.FC = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('ThemeContext is not provided');
  }

  const { theme, toggleTheme } = themeContext;

  const toGithub = () => window.open('https://github.com/shinexoh/translate-web', '_blank');

  return (
    <div css={styles.wrapper}>
      <RiTranslate css={styles.logo} />
      <div css={styles.links}>
        <button type="button" onClick={toGithub} css={styles.linksButton}>
          <RiGithubFill css={styles.link} />
        </button>
        <button type="button" onClick={toggleTheme} css={styles.linksButton}>
          {theme === 'light'
            ? <RiMoonLine css={styles.link} />
            : <RiSunLine css={styles.link} />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
