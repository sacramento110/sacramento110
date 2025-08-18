/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Islamic theme colors
        islamic: {
          green: {
            50: '#f0f9f0',
            100: '#dcf2dc',
            200: '#bbe5bb',
            300: '#8fd48f',
            400: '#5cbd5c',
            500: '#3ba33b',
            600: '#2d8a2d',
            700: '#266d26',
            800: '#225522',
            900: '#1e471e',
          },
          gold: {
            50: '#fefbf3',
            100: '#fdf5e6',
            200: '#fae9c7',
            300: '#f6d89e',
            400: '#f1c373',
            500: '#ecac51',
            600: '#de943a',
            700: '#b8732f',
            800: '#945c2b',
            900: '#784c26',
          },
          navy: {
            50: '#f4f6f8',
            100: '#e8ecf1',
            200: '#d6dde6',
            300: '#bac6d3',
            400: '#98a9bc',
            500: '#7e91a8',
            600: '#6b7d96',
            700: '#5d6d85',
            800: '#4f5c6e',
            900: '#434d5c',
          }
        }
      },
      fontFamily: {
        'arabic': ['Amiri', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'islamic-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f1c373\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 163, 59, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(59, 163, 59, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
