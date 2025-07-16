import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model } from "mongoose";
import { UserRole } from "./user.constant";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async createUser(): Promise<any> {
    const newUser = await this.userModel.create({
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      phoneNumber: "1234567890",
      role: UserRole.USER,
      password: "password123",
      isChangedPassword: false,
    });

    console.log("New user created:", newUser);
  }
}
