import CreateHeader from '@/components/create/create-header';
import MaxWidthContainer from '@/components/create/max-width-container';
import React from 'react'

type Props = {}

const Styles = (props: Props) => {
  return (
    <MaxWidthContainer>
      <CreateHeader
        title="Styles"
        description="Choose a style for your book."
        continueConfig={{
          title: "Review",
          pathname: "/create/review",
        }}
      />

    </MaxWidthContainer>
  )
}

export default Styles;