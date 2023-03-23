'use client';

import React, { useEffect } from 'react'

// next
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

import { FiMoreHorizontal } from "react-icons/fi";

type Props = {}

const createRoutes = [
  // character, storyboard, cover, styles, review.
  {
    pathname: '/create/characters',
    path: 'Characters',
  },
  {
    pathname: '/create/storyboard',
    path: 'Storyboard',
  },
  {
    pathname: '/create/cover',
    path: 'Cover',
  },
  {
    pathname: '/create/styles',
    path: 'Styles',
  },
  {
    pathname: '/create/review',
    path: 'Review',
  },
];

const LeftSideBar: React.FC<{}> = ({}) => {

  const pathName = usePathname();

  return (
    <div className='flex flex-col justify-between w-full h-full border-r border-r-light-divider dark:border-r-dark-divider'>

      <div>
        { createRoutes.map((route, index) => {
          return (
            <Link key={index} href={route?.pathname}>
              <button 
                className={
                  clsx('flex items-center justify-center w-full h-16 border-b border-b-light-divider dark:border-b-dark-divider transition-all active:opacity-50',
                    // { 'hover:dark:bg-dark-background-secondary hover:bg-light-background-secondary': !isActive },
                    { 'dark:bg-dark-background-secondary bg-light-background-secondary text-light-text-primary dark:text-dark-text-primary': pathName === route.pathname },
                    { 'text-light-text-tertiary dark:text-dark-text-tertiary': pathName !== route.pathname}
                  )
                }
              >
                <span className='font-semibold'>{route.path}</span>
              </button>
            </Link>
          )
        })}
      </div>

      <div className='flex flex-row justify-between p-3 items-center border-t border-t-light-divider dark:border-t-dark-divider'>

        <div className='flex flex-row gap-3 items-center'>

          {/* @ts-ignore */}
          <img
            src='https://pbs.twimg.com/profile_images/1631949874001498113/At1b9Wrr_400x400.jpg'
            className='rounded-full w-9 h-9'
            alt='profile image'
          />

          <div className=' flex flex-col gap-0'>
            <span className='text-sm'>Mark</span>
            <span className='text-light-text-secondary dark:text-dark-text-secondary text-sm'>Edit Profile</span>
          </div>
        </div>

        <FiMoreHorizontal className='text-light-text-secondary dark:text-dark-text-secondary'/>

      </div>
    </div>
  )
}

export default LeftSideBar;