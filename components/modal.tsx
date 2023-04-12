import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiPlus } from "react-icons/fi";

const Modal:React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  withCloseButton?: boolean;
  children: React.ReactNode;
}> = ({
  isOpen,
  onClose,
  title="",
  withCloseButton=true,
  children
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
              <Dialog.Panel className="flex flex-col overflow-hidden rounded-xl bg-light-background-primary dark:bg-dark-background-primary shadow-xl transition-all max-w-lg w-full">
                <div className="flex flex-col items-start h-full w-full">

                  <div className="flex items-center justify-between w-full pl-3 py-3 pr-3">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-medium text-light-text-primary dark:text-dark-text-primary pl-3"
                      >
                        { title }
                      </Dialog.Title>

                      { withCloseButton &&
                        <button
                          type="button"
                          className="text-light-text-primary dark:text-dark-text-primary hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary rounded-full p-2"
                          onClick={onClose}
                        >
                          <FiPlus className="w-6 h-6 rotate-45 text-light-text-tertiary dark:text-dark-text-tertiary" />
                        </button>
                      }
                  </div>

                  <div className="flex w-full h-full">
                    { children }
                  </div>

                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}


export default Modal;