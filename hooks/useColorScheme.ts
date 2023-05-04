import React from "react";

const useColorScheme = () => {

  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(false);

  const toggleColorSchemToLight = () => {
    document.documentElement.classList.remove("dark");
    // setIsDarkMode(false);
    localStorage.theme = "light";
    setIsDarkMode(false);
  };

  const toggleColorSchemeToDark = () => {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
    setIsDarkMode(true);
  };

  const toggleColorScheme = () => {
    if (localStorage.theme === "dark") {
      toggleColorSchemToLight();
    } else {
      toggleColorSchemeToDark();
    }
  };

  return { isDarkMode, toggleColorScheme }
}

export default useColorScheme;