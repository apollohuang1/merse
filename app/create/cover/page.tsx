'use client'

import CreateHeader from '@/components/create/create-header'
import MaxWidthContainer from '@/components/create/max-width-container'
import { createRoutes } from '@/util/create-constants'
import React from 'react'
import { FiArrowRight } from 'react-icons/fi'

type Props = {}

const Cover = (props: Props) => {
  return (
    <div className="grid grid-rows-[100px_auto] overflow-auto">

      {/* top of grid */}
      <CreateHeader currentRoute={createRoutes[3]} />

      <div className="flex flex-col w-full h-full justify-center items-center">
  
        <div className="flex flex-col w-full h-full justify-between items-center max-w-3xl py-6">

          {/* <div className='flex flex-col w-full items-center justify-center bg-indigo-500'> */}
            {/* book cover */}
              <img 
                src='https://www.comicsauthority.store/wp-content/uploads/2023/01/cover-smaller-e1672592557757.png'
                className='object-cover rounded-md aspect-[2/3] w-[400px]'
                alt='comic book cover'
              />
          {/* </div> */}


          {/* chat bar at the bottom */}
          <div className="block px-7 w-full">
            <div className="flex flex-row h-12 bg-light-background-secondary dark:bg-dark-background-secondary px-4 rounded-md flex-shrink-0 border border-light-divider dark:border-dark-divider">
              <div className="flex flex-row items-center justify-center h-full w-full">

                <input
                  type="text"
                  className="w-full h-full text-light-text-primary dark:text-dark-text-primary bg-light-background-secondary dark:bg-dark-background-secondary focus:outline-none placeholder:text-light-text-tertiary dark:placeholder:text-dark-text-tertiary"
                  placeholder="Type a message..."
                />

                {/* send button */}
                <button className="flex items-center justify-center w-8 h-8 ml-2 bg-light-background-secondary dark:bg-dark-background-secondary hover:bg-light-background-tertiary dark:hover:bg-dark-background-tertiary active:opacity-70 rounded-md">
                  <FiArrowRight className="w-5 h-5 text-light-text-primary dark:text-dark-text-primary" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
      
  )
}

export default Cover