import { Character } from "./character";

export interface Entry {
  _id: string;
  title: string;
  style_reference: StyleReference | null;
  content: Object | null;
  characters: Character[];
  storyboard: Object | null;
  cover: Object | null;
  review: Object | null;
}

interface StyleReference {
  artist: string,
  artwork: {
    url: string;
  }
}