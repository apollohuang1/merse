//ImageContext.tsx
import React from 'react';

// Initial state can be empty
const ImageContext = React.createContext({
  updated_image_base64_variants: []
});

export default ImageContext;
