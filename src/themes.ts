import { css, type Theme } from '@emotion/react';

// 全局样式
function globalStyles(theme: Theme) {
  return (
    css`
      * {
        box-sizing: border-box;
        font-family: 'Noto Sans SC', sans-serif;
      }
      body {
        margin: 0;
        padding: 0;
        background-color: ${theme.colors.backgroundColor};
      }
      a {
        text-decoration: none;
      }
    `
  );
}

// 浅色主题
const lightTheme: Theme = {
  colors: {
    primaryColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(250, 250, 250)',
    borderColor: 'rgb(235, 235, 235)',
    iconColor: 'rgb(23, 23, 23)',
    iconHoverColor: 'rgb(102, 102, 102)',
    inputBackgroundColor: 'rgb(255, 255, 255)',
    outputBackgroundColor: 'transparent',
    ioTextColor: 'rgb(23, 23, 23)',
    ioPlaceholderColor: 'rgb(143, 143, 143)',
    ioIconButtonColor: 'rgb(143, 143, 143)',
    ioIconButtonHoverColor: 'rgb(23, 23, 23)',
  },
};

// 深色主题
const darkTheme: Theme = {
  colors: {
    primaryColor: 'rgb(0, 0, 0)',
    backgroundColor: 'rgb(10, 10, 10)',
    borderColor: 'rgb(46, 46, 46)',
    iconColor: 'rgb(237, 237, 237)',
    iconHoverColor: 'rgb(161, 161, 161)',
    inputBackgroundColor: 'transparent',
    outputBackgroundColor: 'rgb(0, 0, 0)',
    ioTextColor: 'rgb(237, 237, 237)',
    ioPlaceholderColor: 'rgb(143, 143, 143)',
    ioIconButtonColor: 'rgb(143, 143, 143)',
    ioIconButtonHoverColor: 'rgb(237, 237, 237)',
  },
};

export { darkTheme, globalStyles, lightTheme };
