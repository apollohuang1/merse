import axios from "axios"


export const useReadEntry = () => {

  const likeEntry = async (userId: string, entryId: string, action: "like" | "unlike") => {
    try {
      const response = await axios({
        method: "POST",
        url: `/api/entries/like/${entryId}`,
        data: {
          action: action,
          userId: userId
        },
        headers: {
          "Authorization": `Bearer ${process.env.MERSE_API_KEY}`
        }
      })

      // reponse is updated entry
      return response
    } catch (error: any) {
      console.log("Failed to like entry: ", error.message)
    }
  }


  return {
    likeEntry
  }
}