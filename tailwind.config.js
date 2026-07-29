/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "amyris-black": "#0a0908",
        "amyris-gold": "#c9a24b",
        "amyris-gold-light": "#e8cd85",
        "amyris-cream": "#f5f0e6",
      },
      fontFamily: {
        display: ['"Bodoni Moda"', "serif"],
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ['"Jost"', "sans-serif"],
      },
      letterSpacing: {
        widest: ".25em",
        "widest-xl": ".35em",
      },
    },
  },
  plugins: [],
};
