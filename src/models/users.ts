import { Schema, model, Types } from "mongoose";

export interface IUsers {
  email: string;
  mobile: number;
  password: string;
  otp: number;
  role: string;
  verified: boolean;
  userInfo?: Types.ObjectId;
  application?: Types.ObjectId;
  requirements?: Types.ObjectId;
}

const userSchema = new Schema<IUsers>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    required: true,
  },
  userInfo: {
    type: Schema.Types.ObjectId,
    ref: "UserInfo",
  },
  application: {
    type: Schema.Types.ObjectId,
    ref: "Application",
  },
  requirements: {
    type: Schema.Types.ObjectId,
    ref: "Requirements",
  },
});

export const Users = model<IUsers>("Users", userSchema);
