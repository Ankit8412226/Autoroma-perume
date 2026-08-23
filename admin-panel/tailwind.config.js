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
          green:    '#0B4F3C', // Deep Architectural Green
          dark:     '#063B2D', // Dark Green
          soft:     '#EAF3EF', // Soft Tint
          warm:     '#FAF9F6', // Warm White
          charcoal: '#171A18', // Charcoal Body/Text
          sky:      '#0EA5E9', // Sky Blue Accent
        },
        bgDark: '#0F172A',
        cardDark: '#111827',
        cardBorder: '#1F2937',
        primaryBlue: '#0B4F3C',  // Aligned to House & Sky Brand Green
        accentOrange: '#0EA5E9', // Aligned to Sky Blue Accent
        successGreen: '#22C55E',
        bookedBlue: '#3B82F6',
        warningYellow: '#FACC15',
        dangerRed: '#EF4444',
        textMain: '#F8FAFC',
        textMuted: '#94A3B8'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
