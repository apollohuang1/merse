import { CreateRoute } from "@/util/create-constants";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const CreateHeader: React.FC<{
  currentRoute: CreateRoute;
}> = ({ currentRoute }) => {
  return (
    <div className="flex flex-row w-full sticky top-0 z-20 bg-light-background-primary dark:bg-dark-background-primary justify-center px-7">
      <div className="flex flex-row justify-between items-start pt-7 pb-4 w-full max-w-4xl">
        <div className="flex flex-col max-w-sm">
          <h1 className="text-2xl font-bold">
            {currentRoute?.title ?? "Title"}
          </h1>
          <p className="text-light-text-secondary font-light">
            {currentRoute?.description ?? "Description"}
          </p>
        </div>

        <div className="flex flex-row gap-4">
          {/* back button */}
          {currentRoute?.backConfig && (
            <Link
              href={currentRoute?.backConfig?.pathname ?? "/"}
              className="group inline-flex items-center justify-center rounded-full text-sm gap-1 bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary w-32 h-10 transition-all hover:scale-105 active:scale-100"
            >
              <FiArrowLeft className="text-light-text-primary dark:text-dark-text-primary group-hover:translate-x-[-2px] transition-all hover:duration-300" />
              <span>{currentRoute?.backConfig?.title ?? "Back"}</span>
            </Link>
          )}

          <Link
            href={currentRoute?.nextConfig?.pathname ?? "/"}
            className="group inline-flex items-center justify-center rounded-full text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary w-32 h-10 transition-all hover:scale-105 active:scale-100 bg-light-background-secondary dark:bg-dark-background-secondary"
          >
            <span>{currentRoute?.nextConfig?.title ?? "Finish"}</span>
            <FiArrowRight className="text-light-text-primary dark:text-dark-text-primary group-hover:translate-x-[-2px] transition-all hover:duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateHeader;
