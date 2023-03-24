import CreateHeader from '@/components/create/create-header';
import MaxWidthContainer from '@/components/create/max-width-container';
import React from 'react'

type Props = {}

const Storyboard = (props: Props) => {
  return (
    <MaxWidthContainer>
      <CreateHeader 
        title="Storyboard"
        description="Add scenes to your story."
        continueConfig={{
          title: "Cover",
          pathname: "/create/cover", 
        }}
      />


    </MaxWidthContainer>
  )
}

export default Storyboard;