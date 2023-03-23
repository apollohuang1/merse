import React from 'react'

type Props = {}

const MaxWidthContainer: React.FC<{
  children: React.ReactNode
}> = ({
  children
}) => {
  return (
    <div className='flex w-full h-full justify-center'>
      <div className='flex flex-col max-w-5xl w-full h-full'>
        { children }
      </div>
    </div>
  )
}

export default MaxWidthContainer;