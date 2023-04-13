import { ObjectId } from "mongoose";
import { Character } from "./character";

export interface Entry {
  _id: string;
  user_id: string;
  title: string;
  style_reference: StyleReference | null;
  content: object | null;
  characters: Character[];
  storyboard: object | null;
  cover: object | null;
  review: object | null;
}

interface StyleReference {
  artist: string,
  artwork: {
    url: string;
  }
}