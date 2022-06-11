/** 
 * @type {import('tailwindcss').Config} 
 * */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        colorPrimary: '#303f9f',
        colorPrimaryDark: "#001970",
        colorPrimaryLight: "##666ad1",
        colorBlack: "#171717",
        colorWhite: "#fafafa",
        colorGreen: "#81c784",
        colorRed: "#bd1f36",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
