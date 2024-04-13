/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        HKGrotesk: ['var(--font-HKGrotesk)'],
        Thunder: ['var(--font-Thunder)'],
        PTMono: ['var(--font-PTMono)'],
        Staatliches: ['var(--font-Staatliches)'],
        Moche: ['var(--font-Moche)'],
        Inter: ['var(--font-Inter)'],
        Jost: ['var(--font-Jost)'],
        Roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
