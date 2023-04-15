import React from "react";

const useColorScheme = () => {

  const toggleColorSchemToLight = () => {
    document.documentElement.classList.remove("dark");
    // setIsDarkMode(false);
    localStorage.theme = "light";
  };

  const toggleColorSchemeToDark = () => {
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
    // setIsDarkMode(true);
  };

  const toggleColorScheme = () => {
    if (localStorage.theme === "dark") {
      toggleColorSchemToLight();
    } else {
      toggleColorSchemeToDark();
    }
  };

  return { toggleColorScheme }
}

export default useColorScheme;