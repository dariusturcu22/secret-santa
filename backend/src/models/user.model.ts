import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
