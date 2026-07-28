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
          primary:   '#080808',
          secondary: '#111111',
          surface:   '#1A1A1A',
          elevated:  '#222222',
        },
        gold: {
          100: '#F7EDD8',
          200: '#E8C98A',
          300: '#C9A96E',
          400: '#A8834A',
          500: '#7A5C2E',
        },
        white: {
          100: '#F5F0E8',
          200: '#D4CEC4',
          300: '#A09890',
          400: '#6B6560',
          500: '#3D3A36',
        },
        amber:   '#8B5E3C',
        rose:    '#9B6B6B',
        sage:    '#5C7A63',
        success: '#4A7C59',
        error:   '#A0522D',
        warning: '#C49A3C',
        info:    '#4A6FA5',
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
