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
        'landingNavigationBar': '42px',
        // 'navigationBar': '56px',
        'navigationBar': '64px',
        'withoutNavigationBarLanding': 'calc(100vh - 42px)', // change number manually if navigation bar height changes
        'withoutNavigationBar': 'calc(100vh - 56px)', // change number manually if navigation bar height changes
      },
      gridTemplateRows: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      padding: {
        'navigationBar': '42px',
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
            // primary: "#F5F5F7", // apple
            secondary: "#F5F5F5",
            // secondary: "#F5F5F7",
            // secondary: "#E8E8ED",
            tertiary: "#E8E8ED",
          },
          text: {
            // primary: '#000000', // black
            // primary: "#0E100E", // green satoshi fontshare
            // primary: "#1D1D1F",
            primary: "#383838",
            // secondary: '#8A8A8E',
            secondary: '#848484',
            tertiary: '#C6C6C6',
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
            // primary: "#0D0D0D", // 13 13 13 rgb
            // primary: "#0E1010", // blue satoshi fontshare
            secondary: "#161816", // green satoshi secondary
            // secondary: "#151515",
            // secondary: "#171A17", // test
            // secondary: "#121212",
            // tertiary: "#2C2C2C",
            tertiary: "#232723", // test
            justalittlebitdarkerthan1c1c1e: "#1D1D1F",
          },
          elevated: {},
          text: {
            primary: '#FFFFFF', // white
            secondary: '#8D8D92',
            // secondary: '#575F58', // satoshi
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
