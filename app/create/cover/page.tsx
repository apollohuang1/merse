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
        continueConfig={{
          title: "Styles",
          pathname: "/create/styles", 
        }}
      />


    </MaxWidthContainer>
  )
}

export default Cover