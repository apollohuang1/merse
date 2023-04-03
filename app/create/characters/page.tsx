"use client";

import CharacterCard from "@/components/create/character-card";
import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import SlideOver from "@/components/slide-over";
import { sampleCharacter } from "@/util/characters";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import { FiEdit2, FiPlus, FiX } from "react-icons/fi";
import { createRoutes } from "../layout";
import { useAppDispatch, useAppSelector } from "@/redux-store/hooks";
import { addCharacter } from "@/redux-store/store";
import { genders } from "@/util/select";

type Props = {};

const CreateCharacterPage = (props: Props) => {

  // redux states
  const entry = useAppSelector((state) => state.entry);
  const dispatch = useAppDispatch();

  const [isEditingCharacter, setIsEditingCharacter] = React.useState(false);
  const [selectedImageData, setSelectedImageData] = React.useState<any>(null);

  const [characterImageURL, setCharacterImageURL] =
    React.useState<string>("");

  const [characterName, setCharacterName] = React.useState<string>("");
  const [characterAge, setCharacterAge] = React.useState<number>(0);
  const [characterGender, setCharacterGender] = React.useState<string>("");

  const [newCharacterDescription, setNewCharacterDescription] =
    React.useState<string>("");

  const clearForm = () => {
    setCharacterImageURL("");
    setCharacterName("");
    setCharacterAge(0);
    setCharacterGender("");
    setNewCharacterDescription("");
  }

  const setEditData = (character: any) => {

  }

  const createNewCharacter = () => {
    dispatch(addCharacter({
      imageURL: characterImageURL,
      name: characterName,
      description: newCharacterDescription,
      age: characterAge,
      gender: characterGender
    }));
  }

  return (
    <>
      <div className="grid grid-rows-[100px_auto] overflow-x-hidden overflow-y-scroll">
        <CreateHeader currentRoute={createRoutes[1]} />

        <div className="flex flex-col w-full h-full justify-center items-center">
          {/* created characters list */}
          <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-6 w-full h-full max-w-4xl py-7">

            <button
              onClick={() => {
                setIsEditingCharacter(true);
              }}
              className="group flex w-full aspect-square hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider items-center justify-center active:opacity-70 rounded-lg"
            >
              <FiPlus className="w-7 h-7 text-light-text-secondary dark:text-dark-text-secondary group-active:scale-90 transition-all" />
            </button>

            {entry?.characters.map((character: any, i: number) => (
              <CharacterCard
                key={i}
                character={character}
                onEditing={() => {
                  setIsEditingCharacter(true);
                  // console.log(character);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* <SlideOver
        isOpen={isEditingCharacter}
        onClose={() => setIsEditingCharacter(false)}
        onOpen={() => setIsEditingCharacter(true)}
        title="Edit Character"
      >
        <div className="flex flex-col gap-4">editing cover</div>
      </SlideOver> */}


      {/* creating new character slideover */}
      <SlideOver
        isOpen={isEditingCharacter}
        onClose={() => setIsEditingCharacter(false)}
        onOpen={() => setIsEditingCharacter(true)}
        title="Create New Character"
        onSubmit={() => {
          createNewCharacter();
          setIsEditingCharacter(false);
          clearForm();
        }}
      >
        <div className="flex flex-col gap-7">
          {/* face image container */}
          <div className="flex flex-row w-full justify-center">

            {/* circle image input */}
            <div className="group relative w-40 h-40 border border-light-divider dark:border-dark-divider rounded-full">
              {selectedImageData || (characterImageURL !== "") ? (
                <Menu as="div" className="flex">
                  <Menu.Button>
                    <div className="flex w-full h-full">
                      {/* image */}
                      <img 
                        src={characterImageURL === "" ? URL.createObjectURL(selectedImageData) : characterImageURL}
                        className="absolute w-full h-full object-cover rounded-full"
                        alt="character face"
                      />

                      {/* overlay  */}
                      <div className="flex absolute w-full h-full items-center justify-center aspect-squar bg-black bg-opacity-20 dark:bg-opacity-30 opacity-0 group-hover:opacity-100 rounded-full group-active:opacity-50 transition-all">
                        <FiEdit2 className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute z-10 w-56 origin-bottom-left bg-light-background-secondary dark:bg-dark-background-secondary focus:outline-none rounded-lg">
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            className={clsx(
                              "flex flex-row items-center px-4 relative text-sm h-12 border-b border-b-light-divider dark:border-b-dark-divider cursor-pointer rounded-t-lg",
                              {
                                "bg-light-background-tertiary dark:bg-dark-background-tertiary":
                                active,
                              }
                            )}
                          >
                            <div>Upload Photo</div>

                            <input
                              type="file"
                              className="group absolute w-full h-full opacity-0 hover:cursor-pointer"
                              accept="image/*"
                              onChange={(e) => {
                                // set selected photo to null
                                e.preventDefault();
                                setSelectedImageData(null);
                              }}
                            />
                          </div>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedImageData(null);
                              setCharacterImageURL("");
                            }}
                            className={clsx(
                              "flex flex-row items-center px-4 text-sm text-light-red dark:text-dark-red cursor-pointer h-12 rounded-b-lg",
                              {
                                "bg-light-background-tertiary dark:bg-dark-background-tertiary":
                                  active,
                              }
                            )}
                          >
                            Remove Current Photo
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <div className="flex absolute w-full h-full items-center justify-center aspect-square bg-light-background-secondary dark:bg-dark-background-secondary rounded-full group-hover:bg-light-background-tertiary dark:group-hover:bg-dark-background-tertiary transition-all group-active:opacity-50">
                  <FiPlus className="w-7 h-7 text-light-text-tertiary  dark:text-dark-text-secondary" />
                  <input
                    type="file"
                    className="group absolute w-full h-full opacity-0 rounded-full hover:cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.files && e.target.files[0]) {
                        setSelectedImageData(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <form
            className="flex flex-col w-full gap-7"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* image url same style as name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="Image URL"
                className="flex text-sm font-medium leading-6"
              >
                Image URL
              </label>

              <input
                type="text"
                name="imageURL"
                id="imageURL"
                enterKeyHint="next"
                className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-emerald-500 rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                value={characterImageURL ?? ""}
                // value={entry?.character?.imageURL ?? ""}
                placeholder="Enter character's image URL"
                onChange={(e) => {
                  setCharacterImageURL(e.target.value);
                }}
              />
            </div>

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
                className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-emerald-500 rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                value={characterName}
                placeholder="Enter character's name"
                onChange={(e) => {
                  setCharacterName(e.target.value);
                }}
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
                className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-emerald-500 rounded-md min-h-[100px] border border-light-divider dark:border-dark-divider bg-transparent"
                value={newCharacterDescription}
                placeholder="Enter character's description"
                onChange={(e) => {
                  setNewCharacterDescription(e.target.value);
                }}
              />
            </div>

            {/* have a space where users put: age/gender/ethnicity, top/bottom clothes descriptions, hair/eye color
            for each characters? maybe for age/gender/ethnicity/colors you could provide a dropdown list for them */}

            <div className="grid grid-cols-2 gap-7">
              <div className="flex flex-col gap-2">
                <label htmlFor="age" className="flex text-sm font-medium">
                  Age
                </label>

                <input
                  type="number"
                  name="age"
                  id="age"
                  enterKeyHint="next"
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-emerald-500 rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                  value={characterAge}
                  placeholder="Enter character's age"
                  onChange={(e: any) => {
                    setCharacterAge(e.target.value);
                  }}
                />
              </div>

              {/* gender */}
              <div className="flex flex-col gap-2">
                <label htmlFor="gender" className="flex text-sm font-medium">
                  Gender
                </label>

                <select
                  id="location"
                  name="location"
                  value={characterGender}
                  // defaultValue={"none"}
                  className="w-full p-3 placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary outline-0 focus:ring-2 focus:ring-emerald-500 rounded-md border border-light-divider dark:border-dark-divider bg-transparent"
                  onChange={(e: any) => setCharacterGender(e.target.value)}
                >
                  { genders.map((gender: any, index: number) => (
                    <option value={gender} key={index}>{gender}</option>  
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
      </SlideOver>
    </>
  );
};

export default CreateCharacterPage;
