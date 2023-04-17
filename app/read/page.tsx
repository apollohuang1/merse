'use client'

import axios from 'axios'
import React, { useEffect } from 'react'

import { useSearchParams } from "next/navigation";

type Props = {}

const ReadPage = (props: Props) => {

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchEntry();
  }, [])

  const fetchEntry = async () => {
    try {
      const id = searchParams?.get('id');
  
      const response = await axios({
        method: 'GET',
        url: `https://comic.merse.co/api/entries?id=${id}`,
      })

      console.log(response.data);

    } catch (error: any) {
      console.log("Failed to fetch entry, message: ", error.message);
    }
  }

  return (
    <div>page</div>
  )
}

export default ReadPage;