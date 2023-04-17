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

// "use client";

// import React, { useState, useEffect } from "react";
// import { FiEdit2, FiArrowRight } from "react-icons/fi";
// import CreateHeader from "@/components/create/create-header";
// import MaxWidthContainer from "@/components/create/max-width-container";
// import { createRoutes } from "@/util/create-constants";
// import { useDispatch } from 'react-redux';
// import { addScene, setIsGeneratingStoryboard, setShowGeneratedStoryboard } from "@/redux-store/store";

// type Props = {
//   entry: {
//     scenes?: Scene[];
//   };
// };

// type Scene = {
//   _id?: string; // Make _id property optional
//   image_base64: string;
//   text: string;
// };

// const newScene = {
//   _id: "", // Add default value for _id property
//   image_base64: "hello1",
//   text: ""
// };

// const LayoutPage = ({ entry }: Props) => {
//   const dispatch = useDispatch();
//   const [imageURLs, setImageURL] = useState(
//     entry?.scenes?.map(scene => scene.image_base64) ?? []
//   );

//   useEffect(() => {
//     const sceneToAdd = { ...newScene };
//     dispatch(addScene(sceneToAdd));
//     setGeneratedScene(sceneToAdd); // Update directly with the newScene object
//   }, []);

//   console.log(imageURLs);

//   return (
//     <div className="grid grid-rows-[100px_auto] overflow-auto">
//       {/* top of grid */}
//       <CreateHeader currentRoute={createRoutes[3]} />

//       <div className="flex flex-col w-full h-full justify-center items-center">
//         <div className="flex flex-col w-full h-full justify-between items-center max-w-3xl py-6">
//           {/* book covers */}
//           {imageURLs.map((imageURL, index) => (
//             <div
//               key={index}
//               className="relative flex flex-col w-full bg-light-background-secondary dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider aspect-auto min-w-[400px] mb-4"
//             >
//               {/* overlay */}
//               <div className="absolute w-full h-full items-center justify-center aspect-squar bg-black bg-opacity-30 dark:bg-opacity-30 opacity-0 cursor-pointer transition-all rounded-lg">
//                 <FiEdit2 className="w-9 h-9 text-white" />
//               </div>

//               <img
//                 src={"data:image/png;base64," + imageURL}
//                 alt="comic book cover"
//                 className="object-cover aspect-[4/3]"
//               />

//               {/* story line in storyboard */}
//               <div className="flex p-4">
//                 <p className="text-light-text-primary dark:text-dark-text-primary line-clamp-[8]">
//                   {entry.scenes?.[index].text}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LayoutPage;
