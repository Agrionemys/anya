/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        corporate: {
          ...require("daisyui/src/colors/themes")["[data-theme=corporate]"],
        },
      },
    ],
  },
}
