import { createTheme } from '@mui/material/styles';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    highlighted: true;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', 
        contrastText: '#ffffff'
    },
    background: {
      default: '#f0f7ff', 
      paper: '#ffffff',  
    },
    text: {
      primary: '#1a1d1f',
      secondary: '#6f767e',
    },
  },
  shape: {
    borderRadius: 12, 
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  components: {
    // כאן נכנסות ההגדרות לרכיבים ספציפיים
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
      // כאן מגדירים את ה-Variants
      variants: [
        {
          props: { variant: 'highlighted' as any }, // 'as any' פותר בעיית טיפוסים ב-Custom Variants
          style: {
            backgroundColor: '#000000',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 14px 0 rgba(99, 91, 255, 0.39)',
            '&:hover': {
              backgroundColor: '#5249d7',
              boxShadow: '0 6px 20px rgba(99, 91, 255, 0.23)',
            },
          },
        },
      ],
    },
  },
});

export default theme;