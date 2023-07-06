"use client";

import { Series } from "@/models/series";
import axios from "axios";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {};

const SeriesPage = (props: Props) => {

  const pathname = usePathname();

  // states
  const [series, setSeries] = React.useState<Series | null>(null);

  // methods
  const fetchSeriesWithId = async (seriesId: string) => {
    axios({
      method: "GET",
      url: `/api/series/${seriesId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MERSE_API_KEY}`,
      },
    })
      .then((res) => {
        setSeries(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect
  React.useEffect(() => {
    if (!pathname) return;
    const seriesId = pathname.split("/")[2];
    fetchSeriesWithId(seriesId);
  }, []);

  return (
    <>
      <div className="flex flex-col w-full items-center">
        {/* banner */}
        <div className="flex w-full h-[30vh] bg-light-background-secondary dark:bg-dark-background-secondary flex-shrink-0">
          {series?.cover_image_url ? (
            <img
              src={series?.cover_image_url}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-light-background-secondary dark:bg-dark-background-secondary" />
          )}
        </div>

        {/* <div className="flex flex-col px-6 w-full items-center -translate-y-[64px]"> */}
          <div className="flex flex-col w-full max-w-5xl gap-10 break-words p-6 h-screen">
            <span className="w-full outline-none text-6xl font-semibold text-[#0E100E] dark:text-[#E7FCE8]">
              { series?.title }
            </span>
            <span>TO DO: Adding Episodes here</span>
            {JSON.stringify(series)}
          </div>
        {/* </div> */}

      </div>
    </>
  );
};

export default SeriesPage;
