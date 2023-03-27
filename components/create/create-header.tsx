import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'



export type CreateRouteConfig = {
  next?: { title: string, pathname: string },
  back?: { title: string, pathname: string }
}

const CreateHeader: React.FC<{
  title: string,
  description: string
  createRouteConfig?: CreateRouteConfig
}> = ({
  title,
  description,
  createRouteConfig
}) => {
  return (
    <div className='flex flex-row justify-between items-start w-fulls sticky top-0 z-10 bg-light-background-primary dark:bg-dark-background-primary py-7'>

      <div className='flex flex-col max-w-sm'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-light-text-secondary font-light'>{description}</p>
      </div>

      <div className='flex flex-row gap-3'>

        {/* back button */}
        { createRouteConfig?.back &&
          <Link 
            href={createRouteConfig.back.pathname}
            className="group inline-flex items-center justify-center rounded-full bg-light-background-secondary dark:bg-dark-background-secondary text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 gap-1 text-light-text-primary dark:text-dark-text-primary border border-light-divider dark:border-dark-divider hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary w-32 h-10"
          >
            <FiArrowLeft className='text-light-text-primary dark:text-dark-text-primary group-hover:translate-x-[-2px] transition-all hover:duration-300'/>
            <span>{createRouteConfig?.back?.title}</span>
          </Link>
        }


        {/* { createRouteConfig?.next && */}
          <Link
            href={createRouteConfig?.next?.pathname ?? "/"}
            className={clsx("group inline-flex items-center justify-center rounded-full text-sm gap-1 text-light-text-primary dark:text-dark-text-primary w-32 h-10",
              { " bg-emerald-500 text-white hover:bg-emerald-600": !createRouteConfig?.next },
              { " bg-light-background-secondary dark:bg-dark-background-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-background-tertiary hover:dark:bg-dark-background-tertiary border border-light-divider dark:border-dark-divider": createRouteConfig?.next }
            )}
          >
            <span>{createRouteConfig?.next?.title ?? "Finish"}</span>

            { createRouteConfig?.next &&
              <FiArrowRight className='group-hover:translate-x-[2px] transition-all hover:duration-300'/>
            }

          </Link>
        {/* } */}
      </div>


    </div>
  )
}

export default CreateHeader;