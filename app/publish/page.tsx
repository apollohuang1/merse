"use client";

import { genres } from "@/util/constants/home-constant";
import clsx from "clsx";
import React from "react";
import { FiCheck, FiChevronRight } from "react-icons/fi";

type Props = {};

const PublishPage = (props: Props) => {
  const [title, setTitle] = React.useState<string>("");
  const [coverImageURL, setCoverImageURL] = React.useState<string>("");

  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);

  return (
    <div className="flex flex-col w-full h-full p-6 items-center">
      <div className="flex flex-row justify-between gap-12 w-full max-w-5xl max-md:flex-col max-md:items-center max-md:justify-start">
        {/* series cover image */}
        <div className="relative w-60 h-60 rounded-md border border-light-divider dark:border-dark-divider aspect-square overflow-clip flex-shrink-0">
          {!coverImageURL || coverImageURL === "" ? (
            <></>
          ) : (
            <img
              src={coverImageURL}
              className="w-full h-full object-cover aspect-square"
              onError={() => {
                setCoverImageURL("");
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            id="cover-image"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              console.log(URL.createObjectURL(file));
              setCoverImageURL(URL.createObjectURL(file));
            }}
          />
        </div>

        <div className="flex flex-col w-full gap-12">
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
              <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">{selectedGenres.length}/2</span>
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
                  disabled={selectedGenres.length >= 2 && !selectedGenres.includes(genre)}
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
                        { "text-emerald-500": selectedGenres.includes(genre) },
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
              id="description"
              className="w-full p-4 h-48 bg-transparent outline-none font-normal bg-light-background-secondary dark:bg-dark-background-secondary placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary border-none border-light-dividerContrast dark:border-dark-dividerContrast focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
              placeholder="Description"
            />
          </div>

          <div className="flex flex-row justify-end">
            <button className="px-4 h-10 bg-emerald-500 rounded-full text-white font-medium text-sm hover:bg-emerald-600">
              <div className="flex flex-row gap-1 items-center">
                <span>Create Series</span>
                <div>
                  <FiChevronRight className="w-5 h-5" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPage;
