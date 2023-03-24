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
        createRouteConfig={{
          next: {
            title: "Review",
            pathname: "/create/review",
          },
          back: {
            title: "Cover",
            pathname: "/create/cover",
          }
        }}
      />

    </MaxWidthContainer>
  )
}

export default Styles;