import CreateHeader from '@/components/create/create-header';
import MaxWidthContainer from '@/components/create/max-width-container';
import React from 'react'

type Props = {}

const Characters = (props: Props) => {
  return (
    <MaxWidthContainer>

      <div className=' pt-8'>
        <CreateHeader title='Characters' description="Add characters to your story." continueConfig={{
          title: 'Continue',
          pathname: '/create/storyboard'
        }} />
      </div>
    </MaxWidthContainer>
  )
}

export default Characters;