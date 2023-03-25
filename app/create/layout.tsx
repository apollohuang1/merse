import LeftSideBar from '@/components/create/left-side-bar';
import React from 'react'


export const metadata = {
  title: {
    name: 'Create',
    default: 'Next.js App Router',
    template: '%s | Next.js App Router',
  },
  description:
    'A playground to explore new Next.js App Router features such as nested layouts, instant loading states, streaming, and component level data fetching.',
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="en" className="[color-scheme:dark]">
    {/* <html lang="en"> */}
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata?.description} />
        <title>{metadata?.title?.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </head>

      <body>
        <div className='grid grid-cols-[250px_auto] max-sm:flex max-sm:flex-col w-screen h-screen bg-light-background-primary dark:bg-dark-background-primary text-light-text-primary dark:text-dark-text-primary'>

          {/* left side bar */}
          <div className='flex max-sm:hidden'>
            <LeftSideBar/>
          </div>

          {/* main container */}
          <div className='w-full h-full max-h-screen overflow-scroll'>
            {children}
          </div>

        </div>
      </body>

    </html>
  )
}