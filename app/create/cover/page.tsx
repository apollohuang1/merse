import CreateHeader from '@/components/create/create-header'
import MaxWidthContainer from '@/components/create/max-width-container'
import React from 'react'

type Props = {}

const Cover = (props: Props) => {
  return (
    <MaxWidthContainer>
      <CreateHeader
        title="Cover"
        description="Create a cover to your book."
        createRouteConfig={{
          next: {
            title: "Styles",
            pathname: "/create/styles",
          },
          back: {
            title: "Storyboard",
            pathname: "/create/storyboard",
          }
        }}
      />


    </MaxWidthContainer>
  )
}

export default Cover