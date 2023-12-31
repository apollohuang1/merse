"use client";

import React, { useEffect } from "react";

// next
import Link from "next/link";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { CreateRoute, createRoutes } from "@/util/constants/create-constants";
import useColorScheme from "@/hooks/useColorScheme";
import { Spinner } from "@chakra-ui/react";
import Alert from "../alert";
import useCreateEntry from "@/hooks/useCreateEntry";
import { FiChevronLeft, FiSun } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { setStep } from "@/redux-store/store";

type Props = {
  entryId: string;
};

const CreateLeftSideBar = (props: Props) => {
  const pathName = usePathname();
  const router = useRouter();

  const { saveEntry } = useCreateEntry();
  const { toggleColorScheme } = useColorScheme();

  const [isSaving, setIsSaving] = React.useState(false);
  const [showDiscardAlert, setShowDiscardAlert] =
    React.useState<boolean>(false);

  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);

  const dispatch = useAppDispatch();

  const createRoutesWithDisable = createRoutes.map((route: CreateRoute) => {
    return {
      ...route,
      disabled:
        route.title.toLowerCase() !== pathName?.split("/")[3]?.toLowerCase(),
    };
  });

  return (
    <>
      <div className="flex flex-col justify-between w-full h-full border-r border-x-light-divider dark:border-x-dark-divider ">
        <div className="flex flex-col">
          <div className="flex h-16 w-full items-center justify-center border-b border-b-light-divider dark:border-dark-divider mb-16">
            <button
              onClick={() => {
                setShowDiscardAlert(true);
              }}
              className="flex flex-row h-full w-full px-6 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary items-center justify-center gap-1"
            >
              <FiChevronLeft className="w-5 h-5 font-medium" />
              <span>Home</span>
            </button>
          </div>

          <div className="flex flex-col gap-0">
            {createRoutes.map((route: CreateRoute, index: number) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    dispatch(setStep(index));
                    // router.push(
                    //   `/create/${props?.entryId}/${route?.title.toLowerCase()}`
                    // );
                  }}
                  disabled={false}
                >
                  <div
                    className={clsx(
                      "flex items-center justify-center w-full h-16 transition-all active:opacity-50 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary",
                      {
                        "bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary transition-all text-lg border-r-[3px] border-r-accent":
                          index === entryHelper?.currentStep,
                      },
                      {
                        "text-light-text-tertiary dark:text-dark-text-tertiary":
                        index !== entryHelper?.currentStep,
                      }
                    )}
                  >
                    <span className="font-semibold">{route?.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-0">

          <div className=" p-5 border-t border-light-divider dark:border-dark-divider">
            <span className="text-sm font-light text-light-text-secondary dark:text-dark-text-secondary">
              ⚠️ We’re using{" "}
              <a
                href="https://stability.ai/stablediffusion"
                // className="underline text-light-text-primary dark:text-dark-text-primary"
                target="_blank"
                className="underline text-emerald-500"
              >
                Stable Diffusion XL
              </a>{" "}
              as a placeholder while model training on our own.
            </span>
          </div>

          <button
            onClick={() => {
              toggleColorScheme();
            }}
            className="flex flex-row h-16 w-full hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary border-l border-l-light-divider dark:border-l-dark-divider items-center justify-center gap-2 border-t border-t-light-divider dark:border-t-dark-divider"
          >
            <FiSun />
          </button>

          <div className="flex flex-row border-t border-t-light-divider dark:border-t-dark-divider">
            {/* discard button */}
            <button
              onClick={() => {
                // window.location.href = "/";
                setShowDiscardAlert(true);
              }}
              className="group h-16 w-full hover:bg-light-red dark:hover:bg-dark-red hover:bg-opacity-20 dark:hover:bg-opacity-20"
            >
              <span className="font-semibold text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-red dark:group-hover:text-dark-red">
                Discard
              </span>
            </button>

            <button
              onClick={async () => {
                setIsSaving(true);

                await saveEntry();

                setIsSaving(false);

                // window.location.href = "/";

                // setTimeout(() => {
                //   setIsSaving(false);
                //   window.location.href =
                //     "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
                // }, 2000);
              }}
              className="flex flex-row h-16 w-full hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary border-l border-l-light-divider dark:border-l-dark-divider items-center justify-center gap-2"
            >
              {isSaving && <Spinner className="w-4 h-4" />}
              <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                {isSaving ? "Saving..." : "Save"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <Alert
        isOpen={showDiscardAlert}
        onClose={() => setShowDiscardAlert(false)}
        title="Progress has not been saved"
        message="Are you sure you want to discard?"
        primaryButtonText="Discard"
        primaryButtonColor="red"
        secondaryButtonText="Cancel"
        onPrimaryButtonClick={() => {
          window.location.href = "/";
        }}
        onSecondaryButtonClick={() => {
          setShowDiscardAlert(false);
        }}
      />
    </>
  );
};

export default CreateLeftSideBar;
