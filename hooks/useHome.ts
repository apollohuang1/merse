'use client';

import { Episode } from "@/models/episode";
import { Series } from "@/models/series";
import axios, { AxiosResponse } from "axios";
import React from "react";

export const useHome = () => {

  const fetchAllSeries = async (): Promise<Series[]> => {
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
      console.log("Failed to fetch all series")
      return [];
    }
  };

  return { fetchAllSeries };
};
