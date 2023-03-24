'use client';

import CharacterCard from "@/components/create/character-card";
import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import SlideOver from "@/components/slide-over";
import { sampleCharacter } from "@/util/characters";
import React from "react";
import { FiPlus } from "react-icons/fi";

type Props = {};

const CreateCharacterPage = (props: Props) => {

  const [isEditingCharacter, setIsEditingCharacter] = React.useState(false);

  return (
    <>
      <MaxWidthContainer>
        <div className="flex flex-col py-8 gap-8">

          <CreateHeader
            title="Characters"
            description="Add characters to your story."
            continueConfig={{
              title: "Continue",
              pathname: "/create/storyboard",
            }}
          />

          {/* created characters list */}
          <div className="grid grid-cols-3 gap-11 w-full h-full">

            {sampleCharacter.map((character, i) => (
              <CharacterCard 
                key={i}
                character={character}
                onEditing={() => {
                  setIsEditingCharacter(true);
                }}
              />
            ))}
            
            <button className='group flex w-full h-full aspect-square hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider items-center justify-center active:opacity-70'>
              <FiPlus className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary group-active:scale-90 transition-all"/>
            </button>

          </div>

        </div>
      </MaxWidthContainer>

      <SlideOver
        isOpen={isEditingCharacter}
        onClose={() => setIsEditingCharacter(false)}
        onOpen={() => setIsEditingCharacter(true)}
      >
        <div className="flex flex-col gap-4">
          hello
        </div>
      </SlideOver>
    </>
  );
};

export default CreateCharacterPage;
