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

const createRoutes = [
  // character, storyboard, cover, styles, review.
  {
    path: '/create/character',
    pathname: 'character',
  },
  {
    path: '/create/storyboard',
    pathname: 'storyboard',
  },
  {
    path: '/create/cover',
    pathname: 'cover',
  },
  {
    path: '/create/styles',
    pathname: 'styles',
  },
  {
    path: '/create/review',
    pathname: 'review',
  },
];

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  return (
    <html lang="en" className="[color-scheme:dark] bg-black">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata?.description} />
        <title>{metadata?.title?.name}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css"></link>
      </head>

      <body>
        <div className='grid grid-cols-[300px_auto] w-screen h-screen'>

          <div className='w-full h-full'>

          </div>

          <div className='w-full h-full'>
            {children}
          </div>

        </div>
      </body>

    </html>
  )
}