/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.pug",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#356b3c',
        'primary-dark': '#2a5530',
        'secondary': '#fdefa7',
      },
    },
  },
  plugins: [],
}