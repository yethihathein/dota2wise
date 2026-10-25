/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          bg: '#141414',
          surface: '#181818',
          card: '#1f1f1f',
          red: '#E50914',
          redHover: '#f40612',
          muted: '#a3a3a3',
          gold: '#d4af37',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
