import React from 'react'

type Props = {}

const CharacterCard = (props: Props) => {
  return (
    <div className='grid grid-rows-[80%_20%] aspect-square bg-light-background-secondary dark:bg-dark-background-secondary'>
      <img 
        src="https://images.unsplash.com/photo-1639628735078-ed2f038a193e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" 
        alt="character image"
        className="w-full h-full object-cover"
      />

      <div className='flex items-center justify-center w-full h-full'>
        Lorem Ipsum
      </div>
    </div>
  )
}

export default CharacterCard;