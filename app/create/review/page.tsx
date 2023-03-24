import CreateHeader from '@/components/create/create-header';
import MaxWidthContainer from '@/components/create/max-width-container';
import React from 'react'

type Props = {}

const Review = (props: Props) => {
  return (
    <MaxWidthContainer>
      <CreateHeader
        title="Review"
        description="Review your story."
      />

    </MaxWidthContainer>
  )
}

export default Review;