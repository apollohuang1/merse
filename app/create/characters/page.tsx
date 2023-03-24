"use client";

import CharacterCard from "@/components/create/character-card";
import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import SlideOver from "@/components/slide-over";
import { sampleCharacter } from "@/util/characters";
import React from "react";
import { FiPlus, FiX } from "react-icons/fi";

type Props = {};

const CreateCharacterPage = (props: Props) => {
  const [isEditingCharacter, setIsEditingCharacter] = React.useState(false);
  const [isCreatingNewCharacter, setIsCreatingNewCharacter] =
    React.useState(false);

  return (
    <>
      <MaxWidthContainer>
        <div className="flex flex-col px-7 gap-8">

          {/* create header */}
          <CreateHeader
            title="Characters"
            description="Add characters to your story."
            continueConfig={{
              title: "Continue",
              pathname: "/create/storyboard",
            }}
          />

          {/* created characters list */}
          <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-7 w-full h-full">
            {sampleCharacter.map((character, i) => (
              <CharacterCard
                key={i}
                character={character}
                onEditing={() => {
                  setIsEditingCharacter(true);
                }}
              />
            ))}

            <button
              onClick={() => {
                setIsCreatingNewCharacter(true);
              }}
              className="group flex w-full h-full aspect-square hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider items-center justify-center active:opacity-70"
            >
              <FiPlus className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary group-active:scale-90 transition-all" />
            </button>
            
          </div>
        </div>
      </MaxWidthContainer>

      <SlideOver
        isOpen={isEditingCharacter}
        onClose={() => setIsEditingCharacter(false)}
        onOpen={() => setIsEditingCharacter(true)}
        title="Edit Character"
      >
        <div className="flex flex-col gap-4">hello</div>
      </SlideOver>

      <SlideOver
        isOpen={isCreatingNewCharacter}
        onClose={() => setIsCreatingNewCharacter(false)}
        onOpen={() => setIsCreatingNewCharacter(true)}
        title="Create New Character"
      >
        <form className="flex h-full flex-col divide-y divide-gray-200">
          <div className="h-0 flex-1 overflow-y-auto">
            <div className="flex flex-1 flex-col justify-between">
              <div className="divide-y divide-gray-200 px-4 sm:px-6">
                <div className="space-y-6 pt-6 pb-5">
                  <div>
                    <label
                      htmlFor="project-name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Project name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="project-name"
                        id="project-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium leading-6 text-gray-900">
                      Team Members
                    </h3>
                    <div className="mt-2">
                      <div className="flex space-x-2">
                        {[].map((person: any) => (
                          <a
                            key={person?.email}
                            href={person?.href}
                            className="rounded-full hover:opacity-75"
                          >
                            <img
                              className="inline-block h-8 w-8 rounded-full"
                              src={person.imageUrl}
                              alt={person.name}
                            />
                          </a>
                        ))}
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="sr-only">Add team member</span>
                          <FiPlus className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <fieldset>
                    <legend className="text-sm font-medium leading-6 text-gray-900">
                      Privacy
                    </legend>
                    <div className="mt-2 space-y-4">
                      <div className="relative flex items-start">
                        <div className="absolute flex h-6 items-center">
                          <input
                            id="privacy-public"
                            name="privacy"
                            aria-describedby="privacy-public-description"
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            defaultChecked
                          />
                        </div>
                        <div className="pl-7 text-sm leading-6">
                          <label
                            htmlFor="privacy-public"
                            className="font-medium text-gray-900"
                          >
                            Public access
                          </label>
                          <p
                            id="privacy-public-description"
                            className="text-gray-500"
                          >
                            Everyone with the link will see this project.
                          </p>
                        </div>
                      </div>
                      <div>
                        <div className="relative flex items-start">
                          <div className="absolute flex h-6 items-center">
                            <input
                              id="privacy-private-to-project"
                              name="privacy"
                              aria-describedby="privacy-private-to-project-description"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="pl-7 text-sm leading-6">
                            <label
                              htmlFor="privacy-private-to-project"
                              className="font-medium text-gray-900"
                            >
                              Private to project members
                            </label>
                            <p
                              id="privacy-private-to-project-description"
                              className="text-gray-500"
                            >
                              Only members of this project would be able to
                              access.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="relative flex items-start">
                          <div className="absolute flex h-6 items-center">
                            <input
                              id="privacy-private"
                              name="privacy"
                              aria-describedby="privacy-private-to-project-description"
                              type="radio"
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                          </div>
                          <div className="pl-7 text-sm leading-6">
                            <label
                              htmlFor="privacy-private"
                              className="font-medium text-gray-900"
                            >
                              Private to you
                            </label>
                            <p
                              id="privacy-private-description"
                              className="text-gray-500"
                            >
                              You are the only one able to access this project.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="pt-4 pb-6">
                  <div className="flex text-sm">
                    <a
                      href="#"
                      className="group inline-flex items-center font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {/* <LinkIcon
                        className="h-5 w-5 text-indigo-500 group-hover:text-indigo-900"
                        aria-hidden="true"
                      /> */}
                      <span className="ml-2">Copy link</span>
                    </a>
                  </div>
                  <div className="mt-4 flex text-sm">
                    <a
                      href="#"
                      className="group inline-flex items-center text-gray-500 hover:text-gray-900"
                    >
                      {/* <QuestionMarkCircleIcon
                        className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      /> */}
                      <span className="ml-2">Learn more about sharing</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-shrink-0 justify-end px-4 py-4">
            <button
              type="button"
              className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => setIsCreatingNewCharacter(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </SlideOver>
    </>
  );
};

export default CreateCharacterPage;
