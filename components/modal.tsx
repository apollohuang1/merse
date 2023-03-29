import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const Modal:React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({
  isOpen,
  onClose,
  title: title,
  children
}) => {

  return (
    <Transition.Root show={isOpen} as={Fragment}>

      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
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
                <div className="flex flex-col items-start p-6 gap-4 h-full w-full">

                  <Dialog.Title
                    as="h3"
                    className="text-base font-medium text-light-text-primary dark:text-dark-text-primary"
                  >
                    { title }
                  </Dialog.Title>

                  { children }

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