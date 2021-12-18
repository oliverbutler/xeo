const colors = require('tailwindcss/colors');

module.exports = {
  important: true,
  content: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ['Inter', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: colors.sky,
        secondary: colors.slate,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
