"use client";

import { Episode } from "@/models/episode";
import { Series } from "@/models/series";
import axios from "axios";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { FiChevronRight } from "react-icons/fi";

type Props = {};

const SeriesPage = (props: Props) => {
  const pathname = usePathname();
  const router = useRouter();

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
            <div className="w-full h-full bg-light-background-secondary dark:bg-dark-background-secondary animate-pulse" />
          )}
        </div>

        {/* <div className="flex flex-col px-6 w-full items-center -translate-y-[64px]"> */}
        <div className="flex flex-col w-full max-w-5xl gap-10 break-words p-6 h-screen">
          <span
            className={clsx(
              "w-full outline-none text-6xl font-semibold text-[#0E100E] dark:text-[#E7FCE8]",
              { "opacity-100" : series?.title },
              { "opacity-0" : !series?.title }
            )}
          >
            {series?.title ?? "Untitled"}
          </span>

          {series?.description && <p>{series?.description}</p>}

          <div className="flex flex-col w-full gap-3">
            <div className="flex flex-row items-center gap-3">
              <h2>Episodes</h2>
            </div>

            <div className="flex flex-col gap-0 divide-y divide-light-divider dark:divide-dark-divider">
              {[1, 2, 3, 4, 5, 6].map((episode: any, index) => (
                <button
                  key={index}
                  onClick={() => {
                    router.push(`/episode/12345`);
                  }}
                  className="flex flex-row hover:bg-light-background-secondary dark:hover:bg-dark-background-secondary h-20 p-3 items-center justify-between gap-6"
                >
                  <div className="flex flex-row gap-6 items-center h-full w-full">
                    <span className="text-light-text-secondary dark:text-dark-text-secondary">
                      {index + 1}
                    </span>

                    <div className="flex flex-row items-start w-full h-full gap-3">
                      <>
                        {series?.cover_image_url ? (
                          <img
                            src={series?.cover_image_url}
                            className="h-full aspect-square object-cover"
                            alt="episode cover image"
                          />
                        ) : (
                          <div className="h-full aspect-square bg-light-background-secondary dark:bg-dark-background-secondary animate-pulse border border-light-dividerContrast dark:border-dark-divider" />
                        )}
                      </>

                      <div className="flex flex-col w-full justify-start items-start text-start h-full">
                        <span className="text-lg font-semibold">
                          Episode {index + 1}
                        </span>
                        <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                          Episode description placeholder
                        </span>
                      </div>
                    </div>
                  </div>

                  <FiChevronRight className="w-5 h-5 text-light-text-tertiary dark:text-dark-text-tertiary" />
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </>
  );
};

export default SeriesPage;
