import mongoose from "mongoose";
import { User } from "./user";


export interface Notification {
  _id?: mongoose.Schema.Types.ObjectId;
  recipient: User;
  sender?: User;
  type: string;
  title?: string;
  body?: string;
  created_at: Date;
  read?: boolean;
}