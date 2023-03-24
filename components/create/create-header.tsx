import React from 'react'
import { FiArrowRight } from 'react-icons/fi'



export type ContinueConfig = {
  title: string,
  pathname: string
}

const CreateHeader: React.FC<{
  title: string,
  description: string
  continueConfig: ContinueConfig
}> = ({
  title,
  description,
  continueConfig
}) => {
  return (
    <div className='flex flex-row justify-between items-center w-fulls'>

      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-light-text-secondary font-light'>{description}</p>
      </div>

      <button className="inline-flex items-center rounded-full bg-light-background-tertiary dark:bg-dark-background-tertiary px-6 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 gap-1 text-light-text-primary dark:text-dark-text-primary">
        <span>Continue</span>
        <FiArrowRight className='text-light-text-primary dark:text-dark-text-primary'/>
      </button>

    </div>
  )
}

export default CreateHeader;