import React from "react";
import NavigationBar from "./navigation-bar";
import Head from "next/head";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="flex flex-col text-light-text-primary dark:text-dark-text-primary items-center h-screen bg-lime-500">
      <div className="flex flex-col items-center justify-center h-navigationBar w-full bg-red-500">
        {/* search bar */}
      </div>
    </div>
  );
};

export default Home;
