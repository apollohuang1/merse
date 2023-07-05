import { Episode } from "@/models/episode";
import { Series } from "@/models/series";
import axios, { AxiosResponse } from "axios";

export const useHome = () => {
  const fetchAllSeries = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: "/api/series",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
        },
      });
      const series = response.data;
      return series;
    } catch (error) {
      console.log(error);
    }
  };

  return { fetchAllSeries };
};
