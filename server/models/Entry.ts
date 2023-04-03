import mongoose, { Schema } from 'mongoose';

export interface IEntry {
  _id: string;
  title: string;
  styleReference: StyleReference;
  content: Object;
  characters: Character[];
}

interface StyleReference {
  artist: string;
}

// age/gender/ethnicity, top/bottom clothes descriptions, hair/eye color
export interface Character {
  _id: string;
  name: string;
  imageURL: string;
  description: string;
  age: number;
  attributes: {
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



const EntrySchema = new Schema<IEntry>({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  styleReference: { type: Object, required: true },
  content: { type: Object, required: true },
  characters: { type: [Object] , required: true },
});

export default mongoose.models.Entry || mongoose.model('Entry', EntrySchema);

