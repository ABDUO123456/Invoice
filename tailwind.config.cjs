/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'invoice-red': '#B22222',
        'invoice-bg': '#f3f4f6',
      }
    },
  },
  plugins: [],
}
