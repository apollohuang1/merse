'use client'

import CreateHeader from "@/components/create/create-header";
import MaxWidthContainer from "@/components/create/max-width-container";
import clsx from "clsx";
import React from "react";
import { FiPlus } from "react-icons/fi";

type Props = {};

type CartoonStyle = {
  id: string;
  artwork: {
    url: string;
  }
}

const styleSamples = [
  // { artwork: { url: "https://www.creativeboom.com/uploads/articles/60/608733e363f17ce03e1e0b77c7c851ee4ade63b9_810.jpg" } },
  // { artwork: { url: "https://cdn.shopify.com/s/files/1/0308/3023/1689/files/170621_love_is_2_in_1024x1024.jpg?v=1582043686" } },
  {
    id: "1",
    artwork: { url: "https://www.comicsauthority.store/wp-content/uploads/2023/01/cover-smaller-e1672592557757.png" } 
  },
  { 
    id: "2",
    artwork: { url: "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9798/6750/9798675032778.jpg" } 
  },
  { 
    id: "3",
    artwork: { url: "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/lrg/9798/6750/9798675043545.jpg" } 
  },
  { 
    id: "4",
    artwork: { url: "https://blog-cdn.reedsy.com/uploads/2019/12/click.jpg" } 
  },
  { 
    id: "5",
    artwork: { url: "https://d23.com/app/uploads/2015/07/walt-files-comic-book-controversary-feat-2.1.jpg" } 
  },
  {
    id: "6",
    artwork: { url: "https://www.comicsauthority.store/wp-content/uploads/2023/03/The_Bestiary_Chronicles_001-2.jpg" } 
  },
  { 
    id: "7",
    artwork: { url: "https://images.fineartamerica.com/images-medium-large-5/every-boys-annual-1950s-uk-mcitnt-the-advertising-archives.jpg" } 
  },
  { 
    id: "8",
    artwork: { url: "https://www.comicsauthority.store/wp-content/uploads/2023/03/The-Letter-Home-Standard-Size.001-copy.jpg" } 
  },
  { 
    id: "9",
    artwork: { url: "https://images.fineartamerica.com/images-medium-large-5/the-boys-book-of-heroes-1940s-uk-the-advertising-archives.jpg" } 
  },
  { 
    id: "10",
    artwork: { url: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/51M2gzuiNuL.jpg" } 
  },
]

const Styles = (props: Props) => {

  const [selectedStyle, setSelectedStyle] = React.useState<CartoonStyle | null>(null);

  return (
    <MaxWidthContainer>
      
      <div className="flex flex-col gap-7">

        <CreateHeader
          title="Styles"
          description="Choose a drawing style for your comic story"
          createRouteConfig={{
            next: {
              title: "Characters",
              pathname: "/create/characters",
            },
          }}
        />

        {/* created characters list */}
        <div className="grid grid-cols-3 max-lg:grid-cols-2 gap-6 w-full h-full">

          {styleSamples.map((style: CartoonStyle, i) => (
            <button key={i} 
              className={clsx(
                "flex aspect-[2/3] hover:scale-[1.04] transition-all hover:z-10 hover:ring-4 hover:ring-emerald-500 hover:rounded-lg",
                { "ring-4 ring-emerald-500 rounded-lg" : style.id === selectedStyle?.id },
                { "opacity-50" : (style.id !== selectedStyle?.id && selectedStyle !== null)}
              )}
              onClick={() => {
                if (style.id === selectedStyle?.id) {
                  setSelectedStyle(null);
                  return;
                }
                setSelectedStyle(style)
              }}
            >
              <img 
                src={style?.artwork?.url}
                className={clsx(
                  "w-full h-full object-cover rounded-lg",
                )}
              />
            </button>
          ))}

          <button
            className="group flex w-full h-full aspect-square hover:bg-light-background-secondary hover:dark:bg-dark-background-secondary border border-light-divider dark:border-dark-divider items-center justify-center active:opacity-70 rounded-lg"
          >
            <div className="flex flex-row gap-2 items-center">
              <FiPlus className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary group-active:scale-90 transition-all" />
              <span className="text-light-text-secondary dark:text-dark-text-secondary">Create Style</span>
            </div>
          </button>

        </div>
      </div>

    </MaxWidthContainer>
  );
};

export default Styles;
