// Beep Design System mapping from beep-v1-webapp
// Based on tailwind.config.js and Button.module.scss

export const BeepDesignTokens = {
  colors: {
    orange: {
      DEFAULT: '#FF9419',
      dark: '#FC7118',
      light: '#FEC788',
      lighter: '#FFF2E3',
    },
    gray: {
      DEFAULT: '#303030',
      50: '#FFFFFF',
      100: '#F9FAFB',
      200: '#F2F2F3',
      300: '#EBEBEB',
      400: '#DEDEDF',
      500: '#D1D1D1',
      600: '#9E9E9E',
      700: '#717171',
      800: '#303030',
      900: '#1C1C1C',
    },
    red: {
      DEFAULT: '#E15343',
      dark: '#C04537',
      light: '#ED988F',
    },
    blue: {
      DEFAULT: '#00B0FF',
      dark: '#0089C7',
      light: '#66D0FF',
    }
  },
  typography: {
    fontFamily: 'Lato, "Open Sans", Helvetica, Arial, sans-serif',
    fontWeight: {
      normal: 400,
      bold: 700,
      black: 900
    },
    letterSpacing: {
      normal: '0',
      wide: '.01em',
      wider: '.02em'
    }
  },
  spacing: {
    borderRadius: {
      DEFAULT: '8px',
      sm: '4px',
      lg: '12px',
      xl: '16px'
    },
    padding: {
      button: {
        primary: { vertical: '12px', horizontal: '16px' }, // tw-py-12 tw-px-16
        text: '8px' // tw-p-8
      }
    }
  },
  button: {
    height: {
      small: '40px',
      normal: '50px'
    },
    styles: {
      'primary-default': {
        background: '#FF9419',
        color: 'white',
        border: '#FF9419'
      },
      'secondary-default': {
        background: 'white',
        color: '#FF9419',
        border: '#FF9419'
      },
      'text-default': {
        background: 'transparent',
        color: '#FF9419',
        border: 'transparent'
      },
      disabled: {
        background: '#DEDEDF',
        color: '#9E9E9E',
        border: '#DEDEDF'
      }
    }
  }
};

// Helper function to get actual style values based on backend data
export function getActualButtonStyle(visualDiff: any): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    fontFamily: BeepDesignTokens.typography.fontFamily,
    fontWeight: BeepDesignTokens.typography.fontWeight.bold,
    letterSpacing: BeepDesignTokens.typography.letterSpacing.wider,
    borderRadius: BeepDesignTokens.spacing.borderRadius.DEFAULT,
    cursor: 'pointer',
    transition: 'all 0.15s'
  };

  // Apply actual values from backend analysis
  if (visualDiff?.property === 'padding') {
    baseStyle.padding = `${visualDiff.actual.vertical} ${visualDiff.actual.horizontal}`;
  }

  if (visualDiff?.property === 'color-contrast') {
    baseStyle.background = visualDiff.actual.background;
    baseStyle.color = visualDiff.actual.foreground;
    baseStyle.border = `1px solid ${visualDiff.actual.background}`;
  }

  if (visualDiff?.property === 'border-radius') {
    baseStyle.borderRadius = visualDiff.actual;
  }

  return baseStyle;
}

// Helper function to get expected style values
export function getExpectedButtonStyle(visualDiff: any): React.CSSProperties {
  const baseStyle: React.CSSProperties = {
    fontFamily: BeepDesignTokens.typography.fontFamily,
    fontWeight: BeepDesignTokens.typography.fontWeight.bold,
    letterSpacing: BeepDesignTokens.typography.letterSpacing.wider,
    borderRadius: BeepDesignTokens.spacing.borderRadius.DEFAULT,
    cursor: 'pointer',
    transition: 'all 0.15s'
  };

  // Apply expected values from backend analysis
  if (visualDiff?.property === 'padding') {
    baseStyle.padding = `${visualDiff.expected.vertical} ${visualDiff.expected.horizontal}`;
  }

  if (visualDiff?.property === 'color-contrast') {
    baseStyle.background = visualDiff.expected.background;
    baseStyle.color = visualDiff.expected.foreground;
    baseStyle.border = `1px solid ${visualDiff.expected.background}`;
  }

  if (visualDiff?.property === 'border-radius') {
    baseStyle.borderRadius = visualDiff.expected;
  }

  return baseStyle;
}