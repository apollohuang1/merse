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
        <div className="flex flex-col gap-8">
          {/* create header */}
          <CreateHeader
            title="Characters"
            description="Add characters to your story."
            createRouteConfig={{
              next: {
                title: "Storyboard",
                pathname: "/create/storyboard",
              },
            }}
          />

          {/* created characters list */}
          <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-7 w-full h-full">
            <button
              onClick={() => {
                setIsCreatingNewCharacter(true);
              }}
              className="group flex w-full h-full aspect-square hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider items-center justify-center active:opacity-70"
            >
              <FiPlus className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary group-active:scale-90 transition-all" />
            </button>

            {sampleCharacter.map((character, i) => (
              <CharacterCard
                key={i}
                character={character}
                onEditing={() => {
                  setIsEditingCharacter(true);
                }}
              />
            ))}
          </div>
        </div>
      </MaxWidthContainer>

      <SlideOver
        isOpen={isEditingCharacter}
        onClose={() => setIsEditingCharacter(false)}
        onOpen={() => setIsEditingCharacter(true)}
        title="Edit Character"
      >
        <div className="flex flex-col gap-4">editing cover</div>
      </SlideOver>

      <SlideOver
        isOpen={isCreatingNewCharacter}
        onClose={() => setIsCreatingNewCharacter(false)}
        onOpen={() => setIsCreatingNewCharacter(true)}
        title="Create New Character"
      >
        <div className="flex flex-col gap-7">
          {/* face image container */}
          <div className="flex flex-row w-full justify-center">
            {/* circle image input */}
            <div className="group relative w-40 h-40">
              <div className="flex absolute w-full h-full items-center justify-center aspect-square bg-light-background-secondary dark:bg-dark-background-secondary rounded-full group-hover:bg-light-background-tertiary dark:group-hover:bg-dark-background-tertiary transition-all group-active:opacity-50 border border-light-divider dark:border-dark-divider">
                <FiPlus className="w-7 h-7 text-light-text-tertiary  dark:text-dark-text-secondary" />
              </div>

              <input
                type="file"
                className="group absolute w-full h-full opacity-0 rounded-full hover:cursor-pointer"
                accept="image/*"
              />
            </div>
          </div>

          <form
            className="flex flex-col w-full gap-7"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* creating cartoon character form and let user input cartoon's composition */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="flex text-sm font-medium leading-6"
              >
                Name
              </label>

              <input
                type="text"
                name="name"
                id="name"
                enterKeyHint="next"
                className="w-full p-3 bg-light-background-secondary dark:bg-dark-background-secondary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter character's name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="flex text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                id="description"
                rows={4}
                className="w-full p-3 bg-light-background-secondary dark:bg-dark-background-secondary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter character's description"
              />
            </div>

            {/* <label htmlFor="image">Image</label>
            <input type="file" name="image" id="image" /> */}
          </form>
        </div>
      </SlideOver>
    </>
  );
};

export default CreateCharacterPage;
