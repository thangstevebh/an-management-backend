export interface IUser {
  _id: string;
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: string;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  iat?: number;
  exp?: number;
}
