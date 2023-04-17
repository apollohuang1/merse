import { ObjectId } from "mongoose";
import { Character } from "./character";

export interface Entry {
  _id: string;
  user_id: string;
  title: string;
  style_reference: StyleReference | null;
  content: object | null;
  characters: Character[];
  // storyboard: object | null;
  scenes: Scene[];
  cover: object | null;
  created_at: Date;
  updated_at: Date;
  // review: object | null;
}

interface StyleReference {
  artist: string,
  artwork: {
    url: string;
  }
}

// scene model
export interface Scene {
  image_base64: string;
  text: string;
}