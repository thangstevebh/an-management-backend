import { ObjectId } from "mongoose";
import { UserRole } from "./user.constant";

export interface IUser {
  _id: ObjectId;

  username?: string;
  phoneNumber: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isChangedPassword?: boolean;
  role: UserRole;

  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}
