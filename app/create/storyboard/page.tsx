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
        createRouteConfig={{
          next: {
            title: "Cover",
            pathname: "/create/cover"
          },
          back: {
            title: "Characters",
            pathname: "/create/characters"
          }
        }}
      />


    </MaxWidthContainer>
  )
}

export default Storyboard;