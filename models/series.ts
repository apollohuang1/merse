import { Episode } from "./episode";

export interface Series {
  title: string;
  author: string;
  genre: string;
  description: string;
  episodes: Episode[];
  cover_image_url: string;
  banner_image_url: string;
  created_at: Date;
}
