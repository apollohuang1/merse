import useCreateEntry from "@/hooks/useCreateEntry";
import { CreateRoute } from "@/util/create-constants";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const CreateHeader: React.FC<{
  currentRoute: CreateRoute;
}> = ({ currentRoute }) => {

  const { saveEntry } = useCreateEntry();

  return (
    <div className="flex flex-row w-full sticky top-0 z-20 backdrop-blur-xl dark:backdrop-blur-xl bg-opacity-80 dark:bg-opacity-90 bg-light-background-primary dark:bg-dark-background-primary justify-center px-7">
      <div className="flex flex-row justify-between items-start py-4 w-full h-full max-w-3xl">
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
              className="group inline-flex items-center justify-center rounded-full text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary w-32 h-10 transition-all hover:scale-105 active:scale-100 bg-light-background-primary dark:bg-dark-background-primary"
            >
              <FiArrowLeft className="text-light-text-primary dark:text-dark-text-primary group-hover:translate-x-[-2px] transition-all hover:duration-300" />
              <span>{currentRoute?.backConfig?.title ?? "Back"}</span>
            </Link>
          )}

          {currentRoute?.nextConfig ? (
            <Link
              href={currentRoute?.nextConfig?.pathname ?? "/"}
              className="group inline-flex items-center justify-center rounded-full text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider w-32 h-10 transition-all hover:scale-105 active:scale-100 hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary bg-light-background-primary dark:bg-dark-background-primary"
            >
              <span>{currentRoute?.nextConfig?.title ?? "Finish"}</span>
              {currentRoute?.nextConfig && (
                <FiArrowRight className="text-light-text-primary dark:text-dark-text-primary group-hover:translate-x-[-2px] transition-all hover:duration-300" />
              )}
            </Link>
          ) : (
            // no next, finish
            <button
              onClick={() => {
                // save an entry
                saveEntry();
              }}
              className="group inline-flex items-center justify-center rounded-full text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider w-32 h-10 transition-all hover:scale-105 active:scale-100 bg-emerald-500 hover:bg-emerald-600"
            >
              <span className="text-white">Finish</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateHeader;
