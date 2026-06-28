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
        brand: {
          50: '#f0f3ff',
          100: '#e1e7ff',
          200: '#c8d3ff',
          300: '#a3b4ff',
          400: '#798eff',
          500: '#5365ff',
          600: '#3a42f5',
          700: '#2c2fdc',
          800: '#2426b3',
          900: '#23268e',
          950: '#151657',
        }
      }
    },
  },
  plugins: [],
}
