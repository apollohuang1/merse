'use client'

import axios from 'axios'
import React, { useEffect, useMemo } from 'react'

import { useSearchParams } from "next/navigation";
import { JSONContent, generateHTML } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import parse from "html-react-parser";
import { Entry } from '@/models/entry';

type Props = {}

const ReadPage = (props: Props) => {

  const searchParams = useSearchParams();

  const [tiptapJSON, setTiptapJSON] = React.useState<JSONContent | null>(null);

  useEffect(() => {
    fetchEntry();
  }, [])

  const fetchEntry = async () => {
    try {
      const id = searchParams?.get('id');
  
      const response = await axios<Entry>({
        method: 'GET',
        url: `/api/entries?id=${id}`,
      })

      console.log(response.data);
      setTiptapJSON(response.data.content);


    } catch (error: any) {
      console.log("Failed to fetch entry, message: ", error.message);
    }
  }

  const output = useMemo(() => {
    if (!tiptapJSON) return null
    return generateHTML(tiptapJSON, [StarterKit]);
  }, [tiptapJSON])

  return (
    <div className="flex flex-col w-full h-full items-center p-6">
      <div className='flex flex-col w-full h-full items-center max-w-4xl'>
        { output &&
          <div className='text-left'>
            { parse(output)}
          </div>
        }
      </div>
    </div>
  )
}

export default ReadPage;