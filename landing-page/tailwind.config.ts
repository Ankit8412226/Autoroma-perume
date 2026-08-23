import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#FAF9F6', // Warm White
          secondary: '#FFFFFF', // Crisp White
          surface:   '#FFFFFF',
          elevated:  '#F4F3EE',
          dark:      '#063B2D', // Deep Dark Green surface option
        },
        brand: {
          green:       '#0B4F3C', // Deep Architectural Green (Logo Source of Truth)
          dark:        '#063B2D', // Dark Green
          soft:        '#EAF3EF', // Soft Architectural Tint
          warm:        '#FAF9F6', // Warm White
          charcoal:    '#171A18', // Charcoal Body/Text
          muted:       '#6D746F', // Muted Gray
          sky:         '#0EA5E9', // Sky Blue Accent
          'sky-light': '#F0F9FF', // Sky Light Tint
        },
        charcoal: {
          100: '#171A18',
          200: '#2D332F',
          300: '#6D746F',
          400: '#949B95',
          500: '#D1D5D2',
        },
        gold: {
          100: '#FAF9F6',
          200: '#EAF3EF',
          300: '#0B4F3C',
          400: '#063B2D',
          500: '#171A18',
        },
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['5.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl':  ['4.25rem', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        'display-lg':  ['3.25rem', { lineHeight: '1.1',  letterSpacing: '0em'    }],
        'heading-xl':  ['2.5rem',  { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'heading-lg':  ['2rem',    { lineHeight: '1.2',  letterSpacing: '0em'    }],
        'heading-md':  ['1.5rem',  { lineHeight: '1.3',  letterSpacing: '0em'    }],
        'body-lg':     ['1.125rem', { lineHeight: '1.6',  letterSpacing: '0em'   }],
        'body-md':     ['1rem',     { lineHeight: '1.65', letterSpacing: '0em'   }],
        'body-sm':     ['0.875rem', { lineHeight: '1.6',  letterSpacing: '0em'   }],
        'label':       ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.15em'}],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
      },
    },
  },
  plugins: [],
}

export default config
