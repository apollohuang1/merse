import React from "react";
import NavigationBar from "./navigation-bar";
import Head from "next/head";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center">

      <NavigationBar isAuthenticated={true} />

      <div className="h-[1000vh] w-full max-w-5xl">
        
      </div>

    </div>
  );
};

export default Home;
