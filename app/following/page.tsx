import Link from 'next/link';
import React from 'react'

type Props = {}

const Subscriptions = (props: Props) => {
  return (
    <div className='flex flex-col w-full h-full items-center justify-center'>
      {/* <div>Following page, nothing to see, go back <Link href={"/"} className='text-accent underline'>home</Link> 🫣</div> */}
      <div>TO DO, following page, go back <Link href={"/"} className='text-accent underline'>home</Link></div>
    </div>
  )
}

export default Subscriptions;