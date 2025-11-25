import mongoose, { Document, Types, Schema } from "mongoose";
import User from "./user.model";
import { IUser } from "./user.model";
import { table } from "node:console";

export interface IEvent extends Document {
  name: string;
  owner: Types.ObjectId | IUser;
  users: (Types.ObjectId | IUser)[];
  pairs: {
    giver: Types.ObjectId | IUser;
    receiver: Types.ObjectId | IUser;
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    pairs: [
      {
        giver: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        receiver: {
          type: Schema.Types.ObjectId,
          ref: "User",
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
