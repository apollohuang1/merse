import { CreateRoute } from "@/app/create/layout";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

const CreateHeader: React.FC<{
  currentRoute: CreateRoute;
}> = ({ currentRoute }) => {
  return (
    <div className="flex flex-row w-full sticky top-0 z-20 bg-light-background-primary dark:bg-dark-background-primary justify-center">
      <div className="flex flex-row justify-between items-start pt-7 pb-4 w-full max-w-4xl">
        <div className="flex flex-col max-w-sm">
          <h1 className="text-2xl font-bold">
            {currentRoute?.title ?? "Title"}
          </h1>
          <p className="text-light-text-secondary font-light">
            {currentRoute?.description ?? "Description"}
          </p>
        </div>

        <div className="flex flex-row gap-3">

          {/* back button */}
          {currentRoute?.backConfig && (
            <Link
              href={currentRoute?.backConfig?.pathname ?? "/"}
              className="group inline-flex items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary w-32 h-10"
            >
              <FiArrowLeft className="text-light-text-primary dark:text-dark-text-primary group-hover:translate-x-[-2px] transition-all hover:duration-300" />
              <span>{currentRoute?.backConfig?.title ?? "Back"}</span>
            </Link>
          )}

          { currentRoute?.nextConfig && (
            <Link
              href={currentRoute?.nextConfig?.pathname ?? "/"}
              className={clsx(
                "group inline-flex items-center justify-center rounded-full text-sm gap-1 text-light-text-primary dark:text-dark-text-primary w-32 h-10",
                {
                  " bg-emerald-500 text-white hover:bg-emerald-600":
                    !currentRoute?.nextConfig,
                },
                {
                  " bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary border border-light-divider dark:border-dark-divider":
                    currentRoute?.nextConfig,
                }
              )}
            >
              <span>{currentRoute?.nextConfig?.title ?? "Finish"}</span>

              { currentRoute?.nextConfig && (
                <FiArrowRight className="group-hover:translate-x-[2px] transition-all hover:duration-300" />
              )}

            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateHeader;
