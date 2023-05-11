import { Transition } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";
import { FiCheckCircle, FiX } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
};

const Notification = (props: Props) => {

  // close the notification after 3 seconds
  useEffect(() => {
    if (props.isOpen) {
      setTimeout(() => {
        props.onClose();
      }, 3000);
    }
  }, [props.isOpen]);

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex flex-col gap-2 items-center justify-end px-4 py-6 sm:items-start sm:p-6 z-[100]"
    >
      {/* will support a multi-notifications later on */}
      { [1].map((notification, index: number) => (
        <div
          key={index}
          className="flex w-full flex-row items-center justify-end space-y-4 sm:items-end"
        >
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={props.isOpen}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-x-2 opacity-0"
            enterTo="translate-x-0 opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-2"
          >
            <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl bg-light-background-primary dark:bg-dark-background-secondary bg-opacity-80 dark:bg-opacity-80 backdrop-blur-lg drop-shadow-2xl ring-1 ring-light-divider dark:ring-dark-divider">
              <div className="px-3 py-3">
                <div className="flex items-center">
                  {/* <div className="flex-shrink-0">
                    <FiCheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div> */}
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {props.title}
                    </p>

                    <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                      {props.message}
                    </p>
                  </div>

                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-full p-1 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={props.onClose}
                    >
                      <span className="sr-only">Close</span>
                      <FiX
                        className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      ))}
    </div>
  );
};

export default Notification;
