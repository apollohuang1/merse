import { Episode } from "@/models/episode";
import { Series } from "@/models/series";
import axios from "axios";

export const usePubish = () => {
  const createNewSeries = async (series: Series) => {
    try {
      const response = await axios({
        method: "POST",
        url: "/api/series",
        data: series,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });

      console.log("successfully created new series, response: ", response.data);
    } catch (error: any) {
      console.log("Failed to create new series, message: ", error.message);
    }
  };

  const createNewEpisode = async (episode: Episode) => {
  }

  return { createNewSeries };
};
