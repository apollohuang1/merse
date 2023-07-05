"use client";

import Modal from "@/components/modal";
import { usePubish } from "@/hooks/usePublish";
import { Series } from "@/models/series";
import { useAppSelector } from "@/redux-store/hooks";
import { genres } from "@/util/constants/home-constant";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import React, { Fragment } from "react";
import {
  FiCheck,
  FiChevronRight,
  FiLink,
  FiPlus,
  FiTrash,
  FiUpload,
} from "react-icons/fi";

type Props = {};

const PublishPage = (props: Props) => {
  // hooks
  const { createNewSeries } = usePubish();
  const auth = useAppSelector((state) => state.auth);

  // states
  const [title, setTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [coverImageURL, setCoverImageURL] = React.useState<string>("");

  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [addingCoverURLText, setAddingCoverURLText] =
    React.useState<string>("");
  const [showCoverURLInputModal, setShowCoverURLInputModal] =
    React.useState<boolean>(false);

  const imgInputRef = React.useRef<HTMLInputElement>(null);

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageURL(URL.createObjectURL(file));
  };

  const handleCreateNewSeries = async () => {
    try {
      const authorId = auth?.currentUser?._id;
      if (!authorId) throw new Error("Author id is not provided");

      const newSeries: Series = {
        title,
        author: authorId,
        description: description,
        genres: selectedGenres,
        cover_image_url: coverImageURL,
      };

      await createNewSeries(newSeries);
    } catch (error: any) {
      console.log("Failed to create new series: ", error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full p-6 items-center">
        <div className="flex flex-row justify-between gap-12 w-full max-w-5xl max-md:flex-col max-md:items-center max-md:justify-start">
          {/* series cover image */}

          <div className="flex flex-col gap-3">
            <input
              ref={imgInputRef}
              type="file"
              accept="image/*"
              id="cover-image"
              className="absolute inset-0 w-full h-full hidden opacity-0 cursor-pointer"
              onChange={handleSelectedFile}
            />

            <Menu as="div" className="relative flex text-left w-full">
              <Menu.Button className="outline-none">
                <div className="group relative flex w-60 h-60 rounded-md border border-light-divider dark:border-dark-divider aspect-square overflow-clip flex-shrink-0 items-center justify-center hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary transition-all">
                  {coverImageURL === "" ? (
                    <div className="flex flex-col items-center gap-3">
                      <FiUpload className="w-8 h-8 text-light-text-secondary dark:text-dark-text-secondary" />
                      <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary text-center">
                        Upload Cover Photo or <br /> Drag and Drop
                      </span>
                    </div>
                  ) : (
                    <img
                      src={coverImageURL}
                      className="w-full h-full object-cover aspect-square"
                      onError={(e) => {
                        setCoverImageURL("");
                      }}
                    />
                  )}

                  {/* <input
                    type="file"
                    accept="image/*"
                    id="cover-image"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => handleSelectedFile(e)}
                  /> */}
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
                <Menu.Items className="absolute z-10 top-3/4 left-1/2 w-56 origin-center rounded-md bg-light-background-primary dark:bg-dark-background-secondary shadow-lg focus:outline-none ring-1 ring-light-divider dark:ring-dark-divider drop-shadow-2xl">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => {
                            imgInputRef?.current?.click();
                          }}
                          className={clsx(
                            "relative w-full flex items-center px-4 h-10 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary",
                            {
                              "bg-light-background-secondary dark:bg-dark-background-tertiary":
                                active,
                            }
                          )}
                        >
                          <FiUpload className="w-4 h-4 mr-2" />
                          Upload Photo
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => setShowCoverURLInputModal(true)}
                          className={clsx(
                            "w-full flex items-center px-4 h-10 text-sm text-light-text-primary dark:text-dark-text-primary hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary",
                            {
                              "bg-light-background-secondary dark:bg-dark-background-tertiary":
                                active,
                            }
                          )}
                        >
                          <FiLink className="w-4 h-4 mr-2" />
                          URL Link
                        </button>
                      )}
                    </Menu.Item>

                    {coverImageURL !== "" && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setCoverImageURL("")}
                            className={clsx(
                              "w-full flex items-center px-4 h-10 text-sm hover:bg-light-background-secondary dark:hover:bg-dark-background-tertiary text-light-red dark:text-dark-red",
                              {
                                "bg-light-background-secondary dark:bg-dark-background-tertiary":
                                  active,
                              }
                            )}
                          >
                            <FiTrash className="w-4 h-4 mr-2" />
                            Remove
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>

          <div className="flex flex-col w-full gap-12 pb-10">
            <input
              type="text"
              id="title"
              className="w-full py-3 bg-transparent outline-none text-3xl font-semibold text-[#0E100E] dark:text-[#E7FCE8] placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary border-b border-light-dividerContrast dark:border-dark-dividerContrast focus:border-emerald-500 dark:focus:border-emerald-500 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Series Title"
            />

            {/* genres grid selection */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-row items-center gap-2">
                <h3 className="">Select 2 Genres</h3>
                <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">
                  {selectedGenres.length}/2
                </span>
              </div>
              <div className="grid grid-cols-4 grid-rows-5 gap-3 max-xl:grid-cols-3 max-lg:grid-cols-2">
                {genres.map((genre, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // max selection is 2
                      if (selectedGenres.includes(genre)) {
                        setSelectedGenres(
                          selectedGenres.filter((g) => g !== genre)
                        );
                      } else {
                        if (selectedGenres.length < 2) {
                          setSelectedGenres([...selectedGenres, genre]);
                        } else {
                          alert("You can only select 2 genres");
                        }
                      }
                    }}
                    disabled={
                      selectedGenres.length >= 2 &&
                      !selectedGenres.includes(genre)
                    }
                  >
                    <div
                      className={clsx(
                        "flex flex-row h-10 gap-3 items-center border rounded-full px-3 hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary transition-all",
                        {
                          "border-emerald-500 text-emerald-500":
                            selectedGenres.includes(genre),
                        },
                        {
                          "border-light-dividerContrast dark:border-dark-dividerContrast":
                            !selectedGenres.includes(genre),
                        }
                      )}
                    >
                      <FiCheck
                        className={clsx(
                          "w-4 h-4",
                          {
                            "text-emerald-500": selectedGenres.includes(genre),
                          },
                          {
                            "text-light-text-tertiary dark:text-dark-text-tertiary":
                              !selectedGenres.includes(genre),
                          }
                        )}
                      />
                      <span className="text-sm">{genre}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="">Description</h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="description"
                className="w-full p-4 h-48 outline-none font-normal bg-light-background-secondary dark:bg-dark-background-secondary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary border-none border-light-dividerContrast dark:border-dark-dividerContrast focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                placeholder="Description"
              />
            </div>

            <div className="flex flex-row justify-end">
              <button
                onClick={handleCreateNewSeries}
                className="px-4 h-10 bg-emerald-500 rounded-full text-white font-medium text-sm hover:bg-emerald-600"
              >
                <div className="flex flex-row gap-1 items-center">
                  {/* <div><FiPlus className="w-4 h-4" /></div> */}
                  <span>Create Series</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showCoverURLInputModal}
        onClose={() => setShowCoverURLInputModal(false)}
        withCloseButton={false}
        title="Add cover Image from URL"
        withPaddingTop={false}
      >
        <div className="flex flex-col w-full h-full gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (addingCoverURLText !== "") {
                setCoverImageURL(addingCoverURLText);
                setShowCoverURLInputModal(false);
                setAddingCoverURLText("");
              }
            }}
          >
            <input
              type="text"
              value={addingCoverURLText}
              placeholder="Paste the image link..."
              onChange={(e) => setAddingCoverURLText(e.target.value)}
              className="flex flex-row w-full h-10 px-4 rounded-md border border-light-divider dark:border-dark-divider bg-light-background-secondary dark:bg-dark-background-secondary focus:border-emerald-500 dark:focus:border-emerald-500 focus:outline-1 outline-none transition-all text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary"
            />
          </form>

          {/* cancel and add buttons on the right hand side */}
          <div className="flex flex-row w-full gap-2 justify-end">
            <button
              onClick={() => {
                setShowCoverURLInputModal(false);
                setAddingCoverURLText("");
              }}
              className="flex flex-row h-8 w-20 text-sm rounded-full outline-none transition-all text-light-text-primary dark:text-dark-text-primary items-center justify-center"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                setCoverImageURL(addingCoverURLText); // change the cover image url state
                setShowCoverURLInputModal(false); // close the modal
                setAddingCoverURLText(""); // reset text input field
              }}
              className="flex flex-row h-8 w-20 text-sm rounded-full bg-accent border border-accent focus:outline-accent outline-none transition-all text-light-text-primary dark:text-dark-text-primary items-center justify-center"
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PublishPage;
