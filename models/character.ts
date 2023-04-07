
// age/gender/ethnicity, top/bottom clothes descriptions, hair/eye color
export interface Character {
  _id: string;
  name: string;
  image_url: string;
  // images?: CharacterImage[];
  description?: string;
  age?: number;
  gender: string;
  attributes?: {
    clothing: {
      top: string;
      bottom: string;
    };
    hair: {
      color: string;
      style: string;
    };
    eyes: {
      color: string;
      style: string;
    };
  };
}

interface CharacterImage {
  url: string,
};