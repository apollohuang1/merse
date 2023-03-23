import CharacterCard from "@/components/create/character-card";
import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import React from "react";

type Props = {};

const CreateCharacterPage = (props: Props) => {
  return (
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
        <div className="grid grid-cols-3 gap-5 w-full h-full">
          {[1, 2, 3, 4, 5].map((_, i) => (
            <CharacterCard key={i} />
          ))}
        </div>

      </div>
    </MaxWidthContainer>
  );
};

export default CreateCharacterPage;
