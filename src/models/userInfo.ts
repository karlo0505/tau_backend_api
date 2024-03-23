import { Schema, model, Types } from "mongoose";

export interface IUserInfo {
  email: string;
  name: string;
  avatar: string;
  address: string;
  birthDate: Date;
  civilStatus: string;
  nameOfSpouse: string;
}

const userInfoSchema = new Schema<IUserInfo>({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  civilStatus: {
    type: String,
    required: true,
  },
  nameOfSpouse: {
    type: String,
    required: false,
  },
});

export const UserInfo = model<IUserInfo>("UserInfo", userInfoSchema);
