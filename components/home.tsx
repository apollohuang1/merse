import React from "react";
import NavigationBar from "./navigation-bar";
import Head from "next/head";

type Props = {};

const Home = (props: Props) => {
  return (
    <div className="flex flex-col">

      <NavigationBar isAuthenticated={true} />

      <div className="h-[1000vh] bg-red-500 w-full">
        hello world
      </div>
    </div>
  );
};

export default Home;
