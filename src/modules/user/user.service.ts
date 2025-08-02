import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import { Model, PipelineStage, Types } from "mongoose";
import { UserRole } from "./user.constant";
import * as bcrypt from "bcrypt";
import { AGENT_USER_COLLECTION, AgentUser } from "../agent/schema/user-agent.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(AgentUser.name)
    private readonly agentUserModel: Model<AgentUser>,
  ) {}

  async createUser(payload: {
    username: string;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    password: string;
    userRole?: UserRole;
  }): Promise<User> {
    const { username, firstName, lastName, phoneNumber, password } = payload;
    let userRole = UserRole.USER;

    if (payload.userRole) userRole = payload.userRole;

    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10),
    );

    const newUser = await this.userModel.create({
      username,
      firstName,
      lastName,
      phoneNumber,
      role: userRole,
      password: passwordHash,
      isChangedPassword: false,
    });

    return newUser.toObject();
  }

  async getUser(payload: {
    _id?: string;
    username?: string;
    phoneNumber?: string;
  }): Promise<User | null> {
    const { _id, username, phoneNumber } = payload;
    const query: Record<string, any> = { isDeleted: false };
    if (_id) {
      query._id = _id;
    }
    if (username) {
      query.username = username;
    }
    if (phoneNumber) {
      query.phoneNumber = phoneNumber;
    }

    const user = await this.userModel.findOne({ ...query }).exec();
    if (!user) {
      return null;
    }
    return user.toObject();
  }

  async getUserAgent(payload: {
    _id?: string;
    username?: string;
    phoneNumber?: string;
    agentId: string;
  }): Promise<
    | (User & {
        agentUser?: AgentUser[];
      })
    | null
  > {
    const matchStage: Record<string, any> = {
      isDeleted: false,
    };

    if (payload._id) {
      matchStage._id = new Types.ObjectId(payload._id);
    }

    if (payload.username) {
      matchStage.username = payload.username;
    }
    if (payload.phoneNumber) {
      matchStage.phoneNumber = payload.phoneNumber;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $lookup: {
          from: AGENT_USER_COLLECTION,
          localField: "_id",
          foreignField: "userId",
          as: "agentUser",
          pipeline: [
            {
              $match: {
                agentId: new Types.ObjectId(payload.agentId),
                isDeleted: false,
                isActive: true,
              },
            },
          ],
        },
      },
      // {
      //   $unwind: { path: "$agentUser", preserveNullAndEmptyArrays: false },
      // },
    ];

    const [user] = await this.userModel.aggregate(pipeline).exec();

    return user || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.userModel.findOne({ username, isDeleted: false }).exec();

    if (!user) {
      return null;
    }

    return user;
  }

  async findUserByPhonenumber(phoneNumber: string): Promise<
    | (User & {
        agentUser?: AgentUser | null;
      })
    | null
  > {
    const user = await this.userModel.findOne({ phoneNumber, isDeleted: false }).exec();

    if (!user) {
      return null;
    }
    const existedUser = user.toObject() as User & { agentUser?: AgentUser | null };

    if (user.role !== UserRole.ADMIN) {
      const agentUser = await this.agentUserModel
        .findOne({ userId: user._id, isDeleted: false, isActive: true })
        .exec();

      const userObject = user.toObject();
      return {
        ...userObject,
        agentUser: agentUser ? agentUser.toObject() : null,
      };
    }

    return existedUser;
  }

  async updateUserPassword(userId: string, newPasswordHash: string): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { _id: userId, isDeleted: false },
        { password: newPasswordHash, isChangedPassword: true },
        { new: true },
      )
      .exec();

    if (!updatedUser) {
      throw new Error("User not found or already deleted");
    }

    return updatedUser.toObject();
  }
}
