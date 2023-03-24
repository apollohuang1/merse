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
    <div className='flex flex-row justify-between items-center w-fulls sticky top-0 z-10 bg-light-background-primary dark:bg-dark-background-primary pt-7 pb-3'>

      <div className='flex flex-col'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-light-text-secondary font-light'>{description}</p>
      </div>

      <button 
        onClick={() => {
          alert('continue')
        }}
        className="inline-flex items-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary px-6 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary"
      >
        <span>Continue</span>
        <FiArrowRight className='text-light-text-primary dark:text-dark-text-primary'/>
      </button>

    </div>
  )
}

export default CreateHeader;