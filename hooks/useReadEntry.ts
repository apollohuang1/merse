import { Entry } from "@/models/entry"
import axios from "axios"


export const useReadEntry = () => {

  const likeEntry = async (userId: string, entry: Entry, action: "like" | "unlike") => {
    try {
      const response = await axios({
        method: "POST",
        url: `/api/entries/like/${entry._id}`,
        data: {
          action: action,
          userId: userId,
          entryId: entry._id,
          entryAuthorId: entry?.author?._id
        },
        headers: {
          "Authorization": `Bearer ${process.env.MERSE_API_KEY}`
        }
      })

      // reponse is updated entry
      return response.data
    } catch (error: any) {
      console.log("Failed to like entry: ", error.message)
    }
  }

  /**
   * Add comment to entry
   * @param userId 
   * @param entryId 
   * @param content 
   * @returns 
   */
  const addComment = async (userId: string, entryId: string, content: string) => {
    try {
      const updatedComments = await axios({
        method: "POST",
        url: `/api/entries/comment`,
        data: {
          entryId: entryId,
          comment: content,
          userId: userId
        },
        headers: {
          "Authorization": `Bearer ${process.env.MERSE_API_KEY}`
        }
      })

      if (!updatedComments) throw new Error("No updated comments array returned.");

      // reponse is updated entry
      return updatedComments.data;
    } catch (error: any) {
      throw new Error(error.message)
    }
  }


  return {
    likeEntry,
    addComment
  }
}