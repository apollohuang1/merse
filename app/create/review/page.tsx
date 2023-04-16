
'use client';

import React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks';
import CreateHeader from '@/components/create/create-header';
import { createRoutes } from '@/util/create-constants';
import {
  setContent,
  setShowGeneratedStoryboard,
  setStoryboard,
  setTitle,
} from "@/redux-store/store";
import useCreateEntry from "@/hooks/useCreateEntry";
import Blockquote from "@tiptap/extension-blockquote";

type Props = {}
//const { base_64, createImageFromText } = useCreateEntry();

// const base64Image = 'data:image/png;base64,' + base_64

const Review = (props: Props) => {

  //const { base_64 } = useCreateEntry();

  // redux states
  const entry = useAppSelector((state) => state.entry);
  const entryHelper = useAppSelector((state) => state.entryHelper);

  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-rows-[100px_auto] overflow-auto">
      <CreateHeader currentRoute={createRoutes[4]} />
      <div className="flex flex-col w-full justify-center items-center overflow-auto">
        {/* main content */}
        <div className="flex flex-col gap-7 w-full h-full max-w-3xl">
          {/* 3 circle with character images */}
          <div className='flex flex-col gap-6'>
            <span className="text-light-text-primary dark:text-dark-text-primary font-bold text-xl">
              Characters
            </span>
            <div className="flex flex-row gap-4">
              {[1, 2, 3].map((i) => (
                // circle image object-cover
                <div
                  key={i}
                  className="w-32 h-32 bg-light-background-secondary dark:bg-dark-background-secondary rounded-full" 
                >
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaCdoBj4sMKAneZ35yzHHceTTZWXaQly7e46eVsJ1oGD29RKEz71w6KG7jyvXw47uDMnQ&usqp=CAU" 
                    alt='character image'
                    className="w-full h-full object-cover rounded-full" 
                  />
                </div>
              ))}
            </div>
          </div>

          <div className='flex flex-col w-full gap-7'>
            { JSON.stringify(entry, null, 2)}
            <br/>
            <br/>
            { JSON.stringify(entryHelper, null, 2)}
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Review;