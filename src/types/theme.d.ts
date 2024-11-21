import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primaryColor: string;
      backgroundColor: string;
      borderColor: string;
      iconColor: string;
      iconHoverColor: string;
      inputBackgroundColor: string;
      outputBackgroundColor: string;
      ioTextColor: string;
      ioPlaceholderColor: string;
      ioIconButtonColor: string;
      ioIconButtonHoverColor: string;
    };
  }
}
