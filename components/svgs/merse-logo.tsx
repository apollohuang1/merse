import React from "react";

type Props = {};

const MerseLogo: React.FC<{
  width?: "10.5px"|"12px"|"20px"|"50px";
}> = ({
  width = "10.5px"
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`w-[10.5px] object-contain stroke-light-text-primary dark:stroke-dark-text-primary`}
      viewBox="0 0 1100 1840"
      fill="none"
    >
      <path
        d="M1050 51H311.203L50 312.203H788.795L1050 51Z"
        strokeWidth="100"
        strokeLinejoin="round"
      />
      <path
        d="M1050 1528.59V51L788.797 312.203V1789.79L1050 1528.59Z"
        strokeWidth="100"
        strokeLinejoin="round"
      />
      <path
        d="M311.203 51V1528.59L50 1789.79V312.203L311.203 51Z"
        strokeWidth="100"
        strokeLinejoin="round"
      />
      <path
        d="M311.203 1528.59H1050L788.795 1789.79H50L311.203 1528.59Z"
        strokeWidth="100"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MerseLogo;
