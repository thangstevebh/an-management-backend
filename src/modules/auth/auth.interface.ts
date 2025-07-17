import { ObjectId } from "mongoose";

export interface IUserJWT {
  _id: string | ObjectId;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
}
