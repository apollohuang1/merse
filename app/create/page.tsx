"use client";
import React from "react";

const Create: React.FC<{}> = ({}) => {
  React.useEffect(() => {
    // redirect to create styles page
    window.location.href = "/create/styles";
  }, []);

  return <div className="flex flex-cols w-full h-full"></div>;
};

export default Create;
