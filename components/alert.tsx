import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import { FiPlus } from "react-icons/fi";

type Props = {};

const Alert: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  withCloseButton?: boolean;
  primaryButtonText?: string;
  onPrimaryButtonClick?: () => void;
  primaryButtonColor?: "accent" | "red";
  secondaryButtonText?: string;
  onSecondaryButtonClick?: () => void;
}> = ({
  isOpen,
  onClose,
  title = "",
  message = "",
  withCloseButton = true,
  primaryButtonText = "OK",
  primaryButtonColor = "accent",
  onPrimaryButtonClick = () => {},
  secondaryButtonText = "Cancel",
  onSecondaryButtonClick = () => {},
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[9999]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-30 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="flex flex-col overflow-hidden rounded-xl bg-light-background-primary dark:bg-dark-background-primary shadow-xl transition-all max-w-md w-full p-5">
                <div className="flex flex-col items-start h-full w-full">

                  {/* header */}
                  <div className="flex items-center justify-between w-full">
                    <Dialog.Title
                      // as="h3"
                      className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary"
                    >
                      {title}
                    </Dialog.Title>

                    {withCloseButton && (
                      <button
                        type="button"
                        className="text-light-text-primary dark:text-dark-text-primary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary rounded-full p-2"
                        onClick={onClose}
                      >
                        <FiPlus className="w-6 h-6 rotate-45 text-light-text-secondary dark:text-dark-text-secondary" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 w-full text-left py-6">
                    <p className="text-light-text-primary dark:text-dark-text-primary font-normal">
                      {message}
                    </p>
                  </div>

                  {/* <div className="flex w-full h-full p-3"> */}
                    {/* cancel and action buttons */}
                    <div className="flex flex-row justify-end items-center w-full gap-2">
                      <button
                        onClick={() => onClose()}
                        className="flex px-3 h-10 hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary rounded-full items-center justify-center"
                      >
                        <span className="font-semibold text-light-text-secondary dark:text-dark-text-secondary">
                          {secondaryButtonText}
                        </span>
                      </button>

                      <button
                        onClick={() => onPrimaryButtonClick()}
                        className={clsx(
                          "flex px-3 h-10 rounded-full items-center justify-center",
                          { "bg-accent hover:bg-emerald-600": primaryButtonColor === "accent" },
                          { "bg-light-red dark:bg-dark-red": primaryButtonColor === "red" }
                        )}
                      >
                        <span
                          className={clsx(
                            "font-normal text-white",
                          )}
                        >
                          { primaryButtonText }
                        </span>
                      </button>
                    </div>
                  {/* </div> */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Alert;
