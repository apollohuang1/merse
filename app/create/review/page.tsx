
'use client';

import React from 'react'
import { useAppDispatch, useAppSelector } from '@/redux-store/hooks';
import CreateHeader from '@/components/create/create-header';
import { createRoutes } from '@/util/create-constants';

type Props = {}

const Review = (props: Props) => {

  // redux states
  const entry = useAppSelector((state) => state.entry);
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

          <div className='flex flex-col w-full'>
            { JSON.stringify(entry, null, 2)}
          </div>


        </div>
      </div>
    </div>
    
  )
}

export default Review;