import clsx from "clsx";
import React from "react";

type Props = {
  direction?: "horizontal" | "vertical";
};

const Divider: React.FC<{
  direction?: "horizontal" | "vertical";
}> = ({
  direction = "horizontal",
}) => {
  return (
    <div
      className={clsx(
        { "w-full border-t border-t-light-divider dark:border-t-dark-divider" : direction === "horizontal" },
        { "h-full border-l border-l-light-divider dark:border-l-dark-divider" : direction === "vertical" },
      )}
    />
  );
};

export default Divider;
