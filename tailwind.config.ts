import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          bright:  '#F0C040',
          dim:     '#8A6F2E',
        },
        dark: {
          DEFAULT: '#080808',
          card:    '#0E0E0E',
          panel:   '#111111',
        },
      },
      fontFamily: {
        head: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
