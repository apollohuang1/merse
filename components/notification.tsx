import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { FiX } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Notification = (props: Props) => {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex flex-col items-center justify-end px-4 py-6 sm:items-start sm:p-6 z-[100]"
    >
      <div className="flex w-full flex-row items-center justify-end space-y-4 sm:items-end">
        {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
        <Transition
          show={props.isOpen}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl bg-light-background-primary dark:bg-dark-background-secondary drop-shadow-2xl ring-1 ring-light-divider dark:ring-dark-divider">
            <div className="px-4 py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {/* <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" /> */}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                    Successfully saved!
                  </p>
                  <p className="mt-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    Anyone with a link can now view this file.
                  </p>
                </div>

                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className="inline-flex rounded-full p-1 hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={props.onClose}
                  >
                    <span className="sr-only">Close</span>
                    <FiX className="h-5 w-5 text-light-text-secondary dark:text-dark-text-secondary" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};

export default Notification;
