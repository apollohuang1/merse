import useCreateEntry from "@/hooks/useCreateEntry";
import { CreateRoute } from "@/util/constants/create-constants";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

type Props = {
  currentRoute: CreateRoute;
  nextDisabled?: boolean;
};

const CreateHeader = (props: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { saveEntry } = useCreateEntry();

  return (
    <div className="flex flex-row w-full sticky top-0 z-20 backdrop-blur-xl dark:backdrop-blur-xl bg-opacity-80 dark:bg-opacity-90 bg-light-background-primary dark:bg-dark-background-primary justify-center px-6">
      <div className="flex flex-row justify-between items-start py-4 w-full h-full max-w-3xl">
        <div className="flex flex-col max-w-sm">
          <h1 className="text-2xl font-bold">
            {props.currentRoute?.title ?? "Title"}
          </h1>
          <p className="text-light-text-secondary font-light">
            {props.currentRoute?.description ?? "Description"}
          </p>
        </div>

        <div className="flex flex-row gap-4">
          {/* back button */}
          {props.currentRoute?.backConfig && (
            <button
              onClick={() => {
                router.push(
                  `/create/${
                    pathname?.split("/")[2]
                  }/${props.currentRoute?.backConfig?.title.toLowerCase()}`
                );
              }}
              className="group inline-flex items-center justify-center rounded-2xl text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider w-32 h-10 transition-all hover:scale-105 active:scale-100 bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary"
            >
              <FiChevronLeft className="text-light-text-primary dark:text-dark-text-primary transition-all hover:duration-300" />
              <span>{props.currentRoute?.backConfig?.title ?? "Back"}</span>
            </button>
          )}

          {props.currentRoute?.nextConfig ? (
            <button
              onClick={() => {
                router.push(
                  `/create/${
                    pathname?.split("/")[2]
                  }/${props.currentRoute?.nextConfig?.title.toLowerCase()}`
                );
              }}
              className={clsx(
                "group inline-flex items-center justify-center rounded-2xl text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider w-32 h-10 transition-all bg-light-background-secondary dark:bg-dark-background-secondary",
                {
                  "hover:scale-105 active:scale-100 hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary":
                    !props.nextDisabled,
                }
              )}
              disabled={props.nextDisabled}
            >
              <span>{props.currentRoute?.nextConfig?.title ?? "Finish"}</span>
              {props.currentRoute?.nextConfig && (
                <FiChevronRight className="text-light-text-primary dark:text-dark-text-primary transition-all hover:duration-300" />
              )}
            </button>
          ) : (
            // review page
            <div className="w-32 h-10 rounded-2xl border border-light-divider dark:border-dark-divider hover:cursor-not-allowed" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateHeader;

// <div className="flex flex-row gap-4">
//   <button
//     onClick={() => {
//       // save an entry
//       saveEntry();
//     }}
//     className="group inline-flex items-center justify-center rounded-2xl text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider w-32 h-10 transition-all hover:scale-105 active:scale-100 bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary"
//   >
//     <span>Save Draft</span>
//   </button>

//   <button
//     onClick={() => {
//       // save an entry
//       saveEntry();
//     }}
//     className="group inline-flex items-center justify-center rounded-2xl text-sm gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider w-32 h-10 transition-all hover:scale-105 active:scale-100 bg-emerald-500 hover:bg-emerald-600"
//   >
//     <span className="text-white">Publish</span>
//   </button>
// </div>
// </div>
