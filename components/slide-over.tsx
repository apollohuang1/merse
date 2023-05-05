"use client";

import React, { Children } from "react";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";

const SlideOver: React.FC<{
  children: React.ReactNode;
  onOpen?: () => void;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
  withCloseButton?: boolean;
  footer?: React.ReactNode;
  // onCancel?: () => void;
  // onSubmit?: () => void;
}> = ({
  children,
  onOpen,
  onClose,
  isOpen,
  title,
  withCloseButton = false,
  footer,
  // onSubmit,
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative text-light-text-primary dark:text-dark-text-primary z-50"
        onClose={onClose}
      >
        {/* curtain overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black dark:bg-white bg-opacity-50 dark:bg-opacity-30 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl border-l border-l-light-divider dark:border-l-dark-divider">
                  <div className="flex h-full flex-col overflow-y-scroll shadow-xl bg-light-background-primary dark:bg-dark-background-primary">
                    {/* <div className="p-4 border-b border-b-light-divider dark:border-b-dark-divider"> */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className=" text-xl font-semibold leading-6 text-light-text-primary dark:text-dark-text-primary">
                          {title}
                        </Dialog.Title>
                        
                        {withCloseButton && (
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-full p-2 bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-secondary dark:text-dark-text-secondary hover:text-gray-500"
                              onClick={() => onClose()}
                            >
                              <span className="sr-only">Close panel</span>
                              <FiX className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex-1 px-4 sm:px-6 overflow-auto">
                      {children}
                    </div>

                    <div className="py-2 border-t border-t-light-divider dark:border-t-dark-divider">
                      { footer }
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SlideOver;
