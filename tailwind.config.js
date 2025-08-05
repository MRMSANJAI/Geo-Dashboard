// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // adjust based on your file structure
  ],
  theme: {
    extend: {
      colors: {
        fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
    
        primaryGreen: "#28A74E",     // Header background, key accents
        tealBlue: "#2EA7E0",         // Buttons, overlays
        neutralGray: "#F8F9FA",      // Backgrounds
        darkText: "#333333",         // Text
        softWhite: "#FFFFFF",        // Clean spacing bg
      },
    },
  },
  plugins: [],
};
