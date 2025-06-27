/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F8F7FF',
          100: '#F1EEFE',
          200: '#E8E4FE',
          300: '#D8D0FD',
          400: '#C4B5FB',
          500: '#8B7FD8',
          600: '#5B4FCF',
          700: '#4C3FB8',
          800: '#3D2F9A',
          900: '#2F1F7A',
        },
        secondary: {
          50: '#F8F7FF',
          100: '#F1EEFE',
          200: '#E8E4FE',
          300: '#D8D0FD',
          400: '#C4B5FB',
          500: '#8B7FD8',
          600: '#7169D4',
          700: '#5B4FCF',
          800: '#483CA5',
          900: '#362A7A',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        surface: '#F8F7FF',
        background: '#FFFFFF',
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'dot-pattern': 'radial-gradient(circle, rgba(91, 79, 207, 0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dot-spacing': '20px 20px',
      },
      animation: {
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}