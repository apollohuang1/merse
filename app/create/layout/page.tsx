"use client";

import React, { useState } from "react";
import createImageFromText from "@/hooks/useCreateEntry";
import { FiArrowRight } from "react-icons/fi";
import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import { createRoutes } from "@/util/create-constants";

type Props = {};

const LayoutPage = (props: Props) => {
    // State variable to store the image URL
    const [imageURL, setImageURL] = useState("");

  return (
    <div className="grid grid-rows-[100px_auto] overflow-auto">
      {/* top of grid */}
      <CreateHeader currentRoute={createRoutes[3]} />

      <div className="flex flex-col w-full h-full justify-center items-center">
        <div className="flex flex-col w-full h-full justify-between items-center max-w-3xl py-6">
          {/* book cover */}
          <img
            src={imageURL} // Use the imageURL in the src attribute
            className="object-cover rounded-md aspect-[2/3] w-[400px]"
            alt="comic book cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
