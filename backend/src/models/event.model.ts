import mongoose, { Document, Types, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IEvent extends Document {
  name: string;
  owner: string;
  users: string[];
  pairs: {
    giver: string;
    receiver: string;
  }[];
  date: Date;
  joinLink: string;
  linkActive: boolean;
  locked: boolean;
}

const EvenSchema: Schema<IEvent> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    users: [
      {
        type: String,
        required: true,
      },
    ],
    pairs: [
      {
        giver: {
          type: String,
          required: true,
        },
        receiver: {
          type: String,
          required: true,
        },
      },
    ],
    date: {
      type: Date,
      required: true,
    },
    joinLink: {
      type: String,
      unique: true,
      required: true,
    },
    linkActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    locked: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model<IEvent>("Event", EvenSchema);
export default Event;
