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

// convert 2023-04-28T19:18:03.259Z string to the same above
export const getFormattedDateFromMongoDBDate = (date: Date | undefined) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}