import jwt from "jsonwebtoken";

export interface userInfo {
  id: number;
  email: string;
  role: string;
  mobile: number;
}

export const generateToken = (userInfo: userInfo) => {
  const privateKey = process.env.SECRET_TOKEN as string;
  const { id, email, role, mobile } = userInfo;
  const expTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  return jwt.sign(
    {
      exp: expTime,
      userInfo: { email, id, role, mobile },
    },
    privateKey
  );
};
