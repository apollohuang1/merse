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

export function getRealTimeDateFormat(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'now';
  } else if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hour ago`;
  } else {
    return `${days} day ago`;
  }
}

export const getLastIdFromUrl = (url: string) => {
  return new URL(url).pathname.split("/").pop();
}

export const htmlStringToText = (html: string) => {
  return html.replace(/<[^>]*>?/gm, '');
}