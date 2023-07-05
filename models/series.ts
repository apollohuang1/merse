import { Episode } from "./episode";
import { User } from "./user";

export interface Series {
  title: string;
  author?: User;
  genres: string[];
  description: string;
  episodes?: Episode[];
  cover_image_url?: string;
  banner_image_url?: string;
}
