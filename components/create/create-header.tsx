import React from 'react'



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
    <div className='flex flex-row justify-between items-center w-full'>
      <div className='flex flex-col'>

        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-light-text-secondary'>{description}</p>
      </div>

      <button className="inline-flex items-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary px-6 py-2 text-sm text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        <span>Continue</span>
      </button>

    </div>
  )
}

export default CreateHeader;