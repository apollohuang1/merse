import mongoose, { ObjectId, Types } from "mongoose";
import { Character } from "./character";
import { IUser } from "./user";

export interface Entry {
  _id: string;
  author: mongoose.Types.ObjectId;
  title: string;
  style_reference: StyleReference | null;
  // content: object | null;
  content: string | null;
  characters: Character[];
  // storyboard: object | null;
  scenes: Scene[];
  cover: object | null;
  created_at?: Date;
  updated_at?: Date;
}

interface StyleReference {
  artist: string,
  artwork: {
    url: string;
  }
}

// scene model
export interface Scene {
  _id: string;
  image_base64: string;
  text: string;
}