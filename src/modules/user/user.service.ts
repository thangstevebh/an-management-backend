import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { UserRole } from "./user.constant";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(payload: {
    username: string;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    password: string;
  }): Promise<User> {
    const { username, firstName, lastName, phoneNumber, password } = payload;

    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
    );

    const newUser = await this.userModel.create({
      username,
      firstName,
      lastName,
      phoneNumber,
      role: UserRole.ADMIN,
      password: passwordHash,
      isChangedPassword: false,
    });

    return newUser.toObject();
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username, isDeleted: false }).exec();

    if (!user) {
      return null;
    }

    return user;
  }

  async findUserByPhonenumber(phoneNumber: string): Promise<User | null> {
    const user = await this.userModel.findOne({ phoneNumber, isDeleted: false }).exec();

    if (!user) {
      return null;
    }

    return user;
  }
}
