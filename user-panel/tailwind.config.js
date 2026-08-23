/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          100: '#F9F5EC',
          200: '#EAD7B0',
          300: '#C9A96E',
          400: '#B08E4F',
          500: '#8C6C31',
        },
      },
    },
  },
  plugins: [],
}
