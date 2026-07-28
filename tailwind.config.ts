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
          primary:   '#000000',
          secondary: '#0A0A0A',
          surface:   '#121212',
          elevated:  '#1C1C1C',
        },
        gold: {
          100: '#FFFFFF',
          200: '#F5F5F5',
          300: '#FFFFFF',
          400: '#D4D4D4',
          500: '#A3A3A3',
        },
        white: {
          100: '#FFFFFF',
          200: '#E5E5E5',
          300: '#A3A3A3',
          400: '#737373',
          500: '#333333',
        },
        amber:   '#E5E5E5',
        rose:    '#D4D4D4',
        sage:    '#D4D4D4',
        success: '#FFFFFF',
        error:   '#E53935',
        warning: '#F5F5F5',
        info:    '#D4D4D4',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['6rem',   { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-xl':  ['4.5rem', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
        'display-lg':  ['3.5rem', { lineHeight: '1.1',  letterSpacing: '0em'    }],
        'heading-xl':  ['2.5rem', { lineHeight: '1.15', letterSpacing: '0.02em' }],
        'heading-lg':  ['2rem',   { lineHeight: '1.2',  letterSpacing: '0.02em' }],
        'heading-md':  ['1.5rem', { lineHeight: '1.3',  letterSpacing: '0.03em' }],
        'body-lg':     ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.01em'}],
        'body-md':     ['1rem',     { lineHeight: '1.65', letterSpacing: '0em'  }],
        'body-sm':     ['0.875rem', { lineHeight: '1.6',  letterSpacing: '0em'  }],
        'label':       ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.12em'}],
      },
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
  plugins: [],
}

export default config
