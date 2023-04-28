import React from "react";

type Props = {};

const SearchPage = (props: Props) => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="flex flex-col items-center">
        <span className="text-lg font-normal">Search</span>
        <input
          type="text"
          className="flex bg-transparent outline-none border-b border-b-light-text-tertiary dark:border-b-dark-text-tertiary max-w-4xl w-[500px] focus:border-b-red-500"
        />
      </div>
    </div>
  );
};

export default SearchPage;
