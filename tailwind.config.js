/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables toggling dark mode via a 'dark' class
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: '#10B981',
        },
        yellow: {
          100: '#FEF3C7',
          800: '#92400E',
        },
      },
      borderRadius: {
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};