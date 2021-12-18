const { join } = require('path');

module.exports = {
  content: [join(__dirname, './src/**/*.{js,ts,jsx,tsx}')],
  darkMode: 'class',
  mode: 'jit',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
