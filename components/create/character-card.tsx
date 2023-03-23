import React from 'react'
import { FiEdit2 } from 'react-icons/fi';

type Props = {}

const CharacterCard = (props: Props) => {
  return (
    <div className='group grid grid-rows-[80%_20%] aspect-square bg-light-background-secondary dark:bg-dark-background-secondary relative'>
      <img 
        src="https://images.unsplash.com/photo-1639628735078-ed2f038a193e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
        alt="character image"
        className="w-full h-full object-cover"
      />

      <div className='flex items-center justify-center w-full h-full'>
        Lorem Ipsum
      </div>

      {/* overlay */}
      <div className='flex flex-col w-full h-full absolute group-hover:bg-black group-hover:bg-opacity-40 cursor-pointer items-center justify-center transition-all active:opacity-70'>
        <FiEdit2 className='w-7 h-7 text-light-text-primary dark:text-dark-text-primary hidden group-hover:block group-active:scale-90 transition-all'/>
      </div>
    </div>
  )
}

export default CharacterCard;