"use client";

import React, { Children } from "react";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import clsx from "clsx";

const SlideOver: React.FC<{
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  onOpen?: () => void;
  onClose: () => void;
  isOpen: boolean;
  title?: string;
  withCloseButton?: boolean;
  footer?: React.ReactNode;
  withOverlay?: boolean;
  withPadding?: boolean;
  // onCancel?: () => void;
  // onSubmit?: () => void;
  slideFrom?: "left" | "right";
  leftMargin?: string;
}> = ({
  children,
  size = "xl",
  onOpen,
  onClose,
  isOpen,
  title,
  withCloseButton = false,
  footer,
  withOverlay = true,
  withPadding = true,
  // onSubmit,
  slideFrom = "right",
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative text-light-text-primary dark:text-dark-text-primary z-50"
        onClose={onClose}
      >
        {/* curtain overlay */}
        {withOverlay && (
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
        )}

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className={`pointer-events-none fixed inset-y-0 ${slideFrom}-0 flex max-w-full ${slideFrom === "right" ? "pl-10" : "pr-10"}`}>
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={`${slideFrom === "left" ? "-translate-x-full" : "translate-x-full"}`}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo={`${slideFrom === "left" ? "-translate-x-full" : "translate-x-full"}`}
              >
                <Dialog.Panel
                  className={`pointer-events-auto w-screen max-w-${size} border-x border-light-divider dark:border-dark-divider drop-shadow-2xl`}
                >
                  <div className="flex h-full flex-col overflow-y-scroll shadow-xl bg-light-background-primary dark:bg-dark-background-primary">
                    <div className="p-6 border-b border-light-divider dark:border-dark-divider">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className=" text-xl font-semibold leading-6 text-light-text-primary dark:text-dark-text-primary">
                          {title}
                        </Dialog.Title>

                        {withCloseButton && (
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-full p-2 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary text-light-text-secondary dark:text-dark-text-secondary hover:text-gray-500"
                              onClick={() => onClose()}
                            >
                              <span className="sr-only">Close panel</span>
                              <FiX className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div 
                      id="comments-slide-over"
                      className={clsx(
                        "flex-1 overflow-auto",
                        { "p-6 sm:px-6" : withPadding}
                      )}
                    >
                      {children}
                    </div>

                    {footer && (
                      <div className="py-2 border-t border-t-light-divider dark:border-t-dark-divider">
                        {footer}
                      </div>
                    )}
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
