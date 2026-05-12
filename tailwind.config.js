/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sakura: '#FFB7C5',
        mimosa: '#FFF4BD',
        mint: '#C1F0C8',
        sky: '#BDE0FE',
        lavender: '#E2CCFF',
        peach: '#FFDAB9',
        pistachio: '#E9FFC2',
        shell: '#FFF1E6',
        coral: '#FFADAD',
        ice: '#D0F4DE',
      },
    },
  },
  plugins: [],
}
