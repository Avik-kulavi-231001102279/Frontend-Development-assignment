/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cinema: {
          950: '#06070a',
          900: '#0B0D13',
          850: '#0f131d',
          800: '#151926',
          700: '#1e2436',
          600: '#2c344d',
          500: '#434e6e',
          400: '#6d7b9d',
          300: '#9aa5be',
          200: '#c5cde0',
          100: '#e5e9f2',
          50: '#f4f6fa',
          red: {
            DEFAULT: '#E50914',
            hover: '#F40612',
            glow: 'rgba(229, 9, 20, 0.35)',
            deep: '#B81D24',
          },
          gold: {
            DEFAULT: '#F5C518',
            hover: '#e2b616',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(229, 9, 20, 0.35)',
        'glow-gold': '0 0 20px rgba(245, 197, 24, 0.3)',
        'cinema-card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'cinema-card-hover': '0 20px 40px -15px rgba(229, 9, 20, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        }
      }
    },
  },
  plugins: [],
}

