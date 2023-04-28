'use client'

import useCreateEntry from '@/hooks/useCreateEntry'
import React, { InputHTMLAttributes } from 'react'

type Props = {}

const Playground = (props: Props) => {

  const [imageData, setImageData] = React.useState<File | null>(null)

  const { handleFileUpload } = useCreateEntry();
  
  return (
    <div>

      {/* file input with upload button */}
      <input 
        type="file"
        accept='image/*'
        // on change with typescript
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return
          setImageData(e.target.files[0])
        }}
      />

      {/* image preview */}
      { imageData &&
        <img src={URL.createObjectURL(imageData)} />
      }

      <button onClick={() => {
        if (!imageData) return
        handleFileUpload(imageData)
      }}>Upload</button>

    </div>
  )
}

export default Playground;