import { createTheme } from '@mui/material/styles';

export const getAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1', // Indigo 500
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#0ea5e9', // Sky 500
        light: '#38bdf8',
        dark: '#0284c7',
        contrastText: '#ffffff',
      },
      success: {
        main: '#10b981', // Emerald 500
        light: '#34d399',
        dark: '#059669',
        contrastText: '#ffffff',
      },
      warning: {
        main: '#f59e0b', // Amber 500
        light: '#fbbf24',
        dark: '#d97706',
        contrastText: '#ffffff',
      },
      error: {
        main: '#ef4444', // Red 500
        light: '#f87171',
        dark: '#dc2626',
        contrastText: '#ffffff',
      },
      info: {
        main: '#3b82f6', // Blue 500
        light: '#60a5fa',
        dark: '#2563eb',
        contrastText: '#ffffff',
      },
      background: {
        default: isDark ? '#0b0f19' : '#f8fafc',
        paper: isDark ? '#111827' : '#ffffff',
        subtle: isDark ? '#1f2937' : '#f1f5f9',
      },
      text: {
        primary: isDark ? '#f9fafb' : '#0f172a',
        secondary: isDark ? '#9ca3af' : '#64748b',
        disabled: isDark ? '#4b5563' : '#94a3b8',
      },
      divider: isDark ? '#1f2937' : '#e2e8f0',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
        selected: isDark ? 'rgba(99, 102, 241, 0.16)' : 'rgba(99, 102, 241, 0.08)',
      },
    },
    typography: {
      fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      h1: {
        fontFamily: `'Plus Jakarta Sans', 'Inter', sans-serif`,
        fontWeight: 700,
      },
      h2: {
        fontFamily: `'Plus Jakarta Sans', 'Inter', sans-serif`,
        fontWeight: 700,
      },
      h3: {
        fontFamily: `'Plus Jakarta Sans', 'Inter', sans-serif`,
        fontWeight: 700,
      },
      h4: {
        fontFamily: `'Plus Jakarta Sans', 'Inter', sans-serif`,
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontFamily: `'Plus Jakarta Sans', 'Inter', sans-serif`,
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontFamily: `'Plus Jakarta Sans', 'Inter', sans-serif`,
        fontWeight: 600,
      },
      subtitle1: {
        fontWeight: 500,
      },
      subtitle2: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 10,
    },
    shadows: [
      'none',
      isDark
        ? '0 1px 2px 0 rgba(0, 0, 0, 0.5)'
        : '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
      isDark
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      isDark
        ? '0 10px 15px -3px rgba(0, 0, 0, 0.6)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -4px rgba(0, 0, 0, 0.07)',
      isDark
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.7)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
      ...Array(20).fill('none'),
    ],
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: isDark ? '#374151 #111827' : '#cbd5e1 #f8fafc',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '0.875rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderRadius: 12,
            border: `1px solid ${isDark ? '#1f2937' : '#e2e8f0'}`,
            boxShadow: isDark
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? '#1f2937' : '#f8fafc',
            '& .MuiTableCell-root': {
              fontWeight: 600,
              fontSize: '0.78rem',
              color: isDark ? '#9ca3af' : '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              borderBottom: `1px solid ${isDark ? '#374151' : '#e2e8f0'}`,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${isDark ? '#1f2937' : '#f1f5f9'}`,
            padding: '14px 16px',
            fontSize: '0.875rem',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
            borderRadius: 6,
          },
        },
      },
    },
  });
};

