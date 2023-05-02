"use client";
import { Spinner } from "@chakra-ui/react";
import React from "react";

const Create: React.FC<{}> = ({}) => {
  
  React.useEffect(() => {
    // redirect to create styles page
    // window.location.href = "/create/styles";
  }, []);

  return (
    <div className="flex flex-cols w-full h-full items-center justify-center">
      <Spinner className="w-6 h-6" />
    </div>
  );
};

export default Create;
