import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

const Home: React.FC<{}> = () => {

  return (
    <div className="flex justify-center items-center w-screen h-screen">

      <div className='flex flex-col items-center gap-4'>
        {/* Comic Journaling */}
        
        <Link href="/create/styles">
          <button className="inline-flex items-center rounded-full bg-accent px-3 py-2 text-sm text-white shadow-sm hover:bg-emerald-600">
            <span>Create comic book</span>
          </button>
        </Link>

        <span className='text-light-text-secondary'>just click the button, ignore the ui in this page for now</span>
      </div>

    </div>
  )
}

export default Home;