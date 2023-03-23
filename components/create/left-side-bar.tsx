import Link from 'next/link';
import React from 'react'

type Props = {}

const createRoutes = [
  // character, storyboard, cover, styles, review.
  {
    path: '/create/characters',
    pathname: 'Characters',
  },
  {
    path: '/create/storyboard',
    pathname: 'Storyboard',
  },
  {
    path: '/create/cover',
    pathname: 'Cover',
  },
  {
    path: '/create/styles',
    pathname: 'Styles',
  },
  {
    path: '/create/review',
    pathname: 'Review',
  },
];

const LeftSideBar = (props: Props) => {
  return (
    <div className='flex flex-col justify-between w-full h-full border-r border-r-light-divider dark:border-r-dark-divider'>

      <div>
        { createRoutes.map((route, index) => {
          return (
            <Link key={index} href={route?.path}>
              <button 
                className='flex items-center justify-center w-full h-16 border-b border-b-light-divider dark:border-b-dark-divider hover:dark:bg-dark-background-secondary hover:bg-light-background-secondary transition-all active:opacity-50'
              >
                <span>{route.pathname}</span>
              </button>
            </Link>
          )
        })}
      </div>

      <div>
        <span>Account</span>
      </div>
    </div>
  )
}

export default LeftSideBar;