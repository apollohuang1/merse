"use client";

import React, { useEffect } from "react";

// next
import Link from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { CreateRoute, allCreateRoutes } from "@/util/create-constants";
import useColorScheme from "@/hooks/useColorScheme";
import { Spinner } from "@chakra-ui/react";
import Alert from "../alert";
import useCreateEntry from "@/hooks/useCreateEntry";

type Props = {
  entryId: string;
};

const CreateLeftSideBar = (props: Props) => {
  const pathName = usePathname();

  const { saveEntry } = useCreateEntry();

  const [isSaving, setIsSaving] = React.useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = React.useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col justify-between w-full h-full border-x border-x-light-divider dark:border-x-dark-divider pt-16">
        <div className="flex flex-col gap-0">
          {allCreateRoutes.map((route: CreateRoute, index) => {
            return (
              <Link key={index} href={`/create/${props.entryId}/${route?.title.toLowerCase()}`}>
                <button
                  className={clsx(
                    "flex items-center justify-center w-full h-16 transition-all active:opacity-50 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary",
                    {
                      "bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary transition-all text-lg border-r-2 border-r-accent":
                        route.title.toLowerCase() === pathName?.split("/")[3]?.toLowerCase(),
                    },
                    {
                      "text-light-text-tertiary dark:text-dark-text-tertiary":
                      route.title.toLowerCase() !== pathName?.split("/")[3]?.toLowerCase()
                    }
                  )}
                >
                  <span className="font-semibold">{route?.title}</span>
                </button>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-row border-t border-t-light-divider dark:border-t-dark-divider">
          {/* discard button */}
          <button
            onClick={() => {
              // window.location.href = "/";
              setShowDiscardAlert(true);
            }}
            className="group h-16 w-full hover:bg-light-red dark:hover:bg-dark-red hover:bg-opacity-30 dark:hover:bg-opacity-20"
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
            className="flex flex-row h-16 w-full hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary border-l border-l-light-divider dark:border-l-dark-divider items-center justify-center gap-2"
          >
            {isSaving && <Spinner className="w-4 h-4" />}
            <span className="font-semibold text-light-text-primary dark:text-dark-text-primary">
              {isSaving ? "Saving..." : "Save Draft"}
            </span>
          </button>
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
