/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // tailwind height
      height: {
        'navigationBar': '42px',
        'withoutNavigationBar': 'calc(100vh - 42px)',
      },
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      colors: {
        // accent: "#4D9D7D", // green
        accent: "#10b981",
        accentSecondary: "#5FA78A", // secondary green
        // accent: "#972B34", // crimson
        // accentSecondary: "#A14048", // crimson
        transparent: "transparent",
        light: {
          accent: "#E52B12",
          appleBlue: "#007AFF", // blue
          divider: "#EFEFEF", // opque
          blue: "#007AFF",
          red: '#FF3B30',
          pink: '#FF2D55',
          green: "#34C759",
          orange: {
            border: '#FF9F0A',
            background: '#FFE2B6',
          },
          background: {
            primary: '#FFFFFF', // white
            // secondary: "#F5F5F5",
            secondary: "#F4F4F4",
            tertiary: "#DDDDDD",
          },
          text: {
            // primary: '#000000', // black
            primary: "#0E100E", // green satoshi fontshare
            secondary: '#8A8A8E',
            tertiary: '#C4C4C6',
          },
        },
        dark: {
          accent: "#E52B12",
          appleBlue: '#0A84FF', // blue
          divider: "#262626", // opaque
          // divider: "#2C302B", // satoshi
          blue: '#0A84FF',
          red: '#FF453A',
          pink: '#FF375F',
          green: "#32D74B",
          orange: {
            border: '#FF9F0A',
            background: '#4D3003',
          },
          background: {
            // primary: '#000000', // black
            primary: "#0E100E", // green satoshi fontshare
            // primary: "#0E1010", // blue satoshi fontshare
            // secondary: "#151515", // green satoshi fontshare
            secondary: "#161816", // normal
            // secondary: "#121212",
            tertiary: "#2C2C2C",
            justalittlebitdarkerthan1c1c1e: "#1D1D1F",
          },
          elevated: {

          },
          text: {
            primary: '#FFFFFF', // white
            // secondary: '#8D8D92',
            secondary: '#575F58', // satoshi
            tertiary: '#47474A',
          },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
