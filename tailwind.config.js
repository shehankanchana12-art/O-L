/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        si: ['"Noto Sans Sinhala"', '"Iskoola Pota"', '"Nirmala UI"', '"LKLUG"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#132033',
        leaf: {
          50: '#eefaf4',
          100: '#d5f2e3',
          500: '#0f9d63',
          600: '#0b7d4f',
          700: '#0a6340',
        },
        sky: {
          50: '#eef4ff',
          100: '#dbe8ff',
          500: '#3167d6',
          600: '#2551b0',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,32,51,.06), 0 8px 24px -12px rgba(19,32,51,.18)',
      },
    },
  },
  plugins: [],
}
