import { CartoonCharacter } from '@/models/cartoon-character';
import React from 'react'
import { FiEdit2 } from 'react-icons/fi';

const CharacterCard: React.FC<{
  character: CartoonCharacter | null
  onEditing?: () => void
}> = ({
  character,
  onEditing
}) => {
  return (
    <div className='group grid grid-rows-[80%_20%] aspect-square bg-light-background-secondary dark:bg-dark-background-secondary relative'>

      <img 
        src={character?.imageURL ?? ""}
        alt="character image"
        className="w-full h-full object-cover"
      />

      <div className='flex items-center justify-center w-full h-full text-light-text-secondary dark:text-dark-text-secondary'>
        { character?.name ?? "Lorem Ipsum"}
      </div>

      {/* overlay */}
      <button
        onClick={onEditing}
        className='flex flex-col w-full h-full absolute group-hover:bg-black group-hover:bg-opacity-20 group-hover:dark:bg-opacity-40 cursor-pointer items-center justify-center transition-all active:opacity-70'
      >
        <FiEdit2 className='w-7 h-7 text-dark-text-primary opacity-0 group-hover:opacity-100 group-active:scale-90 transition-all'/>
      </button>

    </div>
  )
}

export default CharacterCard;