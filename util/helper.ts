// Helpers

export const getImageURLfromBase64 = (base64: string) => {
  return `data:image/jpeg;base64,${base64}`;
}

// Date in October 19, 2002 format
export const getFormattedDate = (dateNumber: number) => {
  return new Date(dateNumber * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}