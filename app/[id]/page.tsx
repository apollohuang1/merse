'use client';

import { Entry } from '@/models/entry';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

type Props = {}

const ProfilePage = (props: Props) => {

  useEffect(() => {
    fetchAllEntries();
  }, [])

  const [allEntries, setAllEntries] = useState<Entry[]>([]);

  const fetchAllEntries = async () => {
    try {
      const response = await axios.get(`/api/entries?userId=6436f3032b67ae01b9c884bb`);
      setAllEntries(response.data);
      
      console.log("All entries")
      console.log(response.data)
    } catch (error: any) {
      console.log(error);
      console.log(error.message);
    }
  }

  return (
    <div className="flex flex-col w-full h-full bg-red-500">
      Profile Page
    </div>
  )
}

export default ProfilePage;