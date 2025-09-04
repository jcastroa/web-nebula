/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          25: '#F5FAFF', // un azul muy clarito, casi blanco
        },
      },
    },
  },
  plugins: [],
}
