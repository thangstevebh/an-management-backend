import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Agent } from "./schema/agent.schema";
import { Model, ObjectId, PipelineStage, Types } from "mongoose";
import { ListAgentsFilterDto } from "./dto/list-agent.dto";
import { QueryOrder } from "@src/_core/constants/common.constants";
import { AGENT_USER_COLLECTION, AgentUser } from "./schema/user-agent.schema";
import { User, USER_COLLECTION } from "../user/schema/user.schema";
import { UserService } from "../user/user.service";
import { AgentRole } from "./agent.constant";
import { ListAgentMembersFilterDto } from "./dto/list-agent-members.dto";
import { paginatingByCount } from "@src/_core/helpers/common.helper";

@Injectable()
export class AgentService {
  constructor(
    @InjectModel(Agent.name)
    private readonly agentModel: Model<Agent>,

    @InjectModel(AgentUser.name)
    private readonly agentUserModel: Model<AgentUser>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    private readonly userService: UserService,
  ) {}

  async getAgent(payload: Record<string, any>, userId?: string): Promise<Agent | null> {
    const query: Record<string, any> = {
      isDeleted: false,
    };

    if (payload._id) {
      query._id = payload._id;
    }
    if (payload.name) {
      query.name = payload.name;
    }

    if (payload.code) {
      query.code = payload.code.toLowerCase();
    }

    const agent = await this.agentModel.findOne(query);

    if (!agent) {
      return null;
    }

    if (userId) {
      const agentUser = await this.agentUserModel.findOne({
        agentId: agent._id,
        userId: new Types.ObjectId(userId),
        isDeleted: false,
      });
      if (!agentUser) {
        return null;
      }
    }

    return agent.toObject();
  }

  async createAgent(payload: Record<string, any>): Promise<Agent> {
    const agent = new this.agentModel(payload);
    agent.save();

    const user = await this.userService.createUser({
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      phoneNumber: payload.phoneNumber,
      password: "123456",
    });

    const agentUser = new this.agentUserModel({
      agentId: agent._id,
      userId: user._id,
      agentRole: payload.agentRole || AgentRole.MEMBER,
    });
    await agentUser.save();

    return agent.toObject();
  }

  async getAgentUser(payload: { agentId: string; userId: string }): Promise<AgentUser | null> {
    const { agentId, userId } = payload;

    const agentUser = await this.agentUserModel.findOne({
      agentId: new Types.ObjectId(agentId),
      userId: new Types.ObjectId(userId),
      isDeleted: false,
    });

    if (!agentUser) {
      return null;
    }

    return agentUser.toObject();
  }

  async addAgentMember(payload: {
    agentId: string;
    username: string;
    firstName?: string;
    lastName?: string;
    phoneNumber: string;
    agentRole?: AgentRole;
  }): Promise<Omit<User, "password">> {
    const { agentId, username, firstName, lastName, phoneNumber, agentRole } = payload;

    const user = await this.userService.createUser({
      username,
      firstName,
      lastName,
      phoneNumber,
      password: "123456",
    });

    const agentUser = new this.agentUserModel({
      agentId: new Types.ObjectId(agentId),
      userId: user._id,
      agentRole: payload.agentRole,
    });

    await agentUser.save();

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async getListAgents(
    payload: ListAgentsFilterDto,
  ): Promise<{ agents: Agent[] | []; pagemeta: Record<string, any> }> {
    const matchStage: Record<string, any> = {
      isDeleted: false,
    };

    if (payload._id) {
      matchStage._id = new Types.ObjectId(payload._id);
    }

    if (payload.agentName) {
      matchStage.name = new RegExp(payload.agentName, "i");
    }
    if (payload.isMain !== undefined) {
      matchStage.isMain = payload.isMain;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      { $sort: { createdAt: payload.order && payload.order === QueryOrder.DESC ? -1 : 1 } },
    ];

    if (payload.isOwnerPopulate) {
      pipeline.push(
        {
          $lookup: {
            from: AGENT_USER_COLLECTION,
            localField: "_id",
            foreignField: "agentId",
            as: "agentUser",
            pipeline: [
              {
                $match: {
                  agentRole: AgentRole.OWNER,
                  isDeleted: false,
                  isActive: true,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: USER_COLLECTION,
            localField: "agentUser.userId",
            foreignField: "_id",
            as: "owner",
            pipeline: [
              {
                $match: {
                  isDeleted: false,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            owner: {
              $map: {
                input: "$owner",
                as: "ownerData",
                in: {
                  _id: "$$ownerData._id",
                  username: "$$ownerData.username",
                  firstName: "$$ownerData.firstName",
                  lastName: "$$ownerData.lastName",
                  phoneNumber: "$$ownerData.phoneNumber",
                  role: "$$ownerData.role",
                  isChangedPassword: "$$ownerData.isChangedPassword",
                  isDeleted: "$$ownerData.isDeleted",
                  deletedAt: "$$ownerData.deletedAt",
                  createdAt: "$$ownerData.createdAt",
                  updatedAt: "$$ownerData.updatedAt",
                },
              },
            },
          },
        },
        {
          $unset: "agentUser",
        },
      );
    }

    const countPipeline = [
      ...pipeline,
      {
        $count: "totalCount",
      },
    ];

    const [totalCountDetail] = await this.agentModel.aggregate(countPipeline).exec();
    let pagemeta: Record<string, any> = paginatingByCount(
      totalCountDetail?.totalCount || 0,
      payload.page ? payload.page : 0,
      payload.limit ? payload.limit : 0,
    );

    if (payload.page && payload.limit) {
      pipeline.push({ $skip: payload.skip });
      pipeline.push({ $limit: payload.limit });
    }

    const agents = await this.agentModel.aggregate(pipeline).exec();

    return {
      pagemeta,
      agents,
    };
  }

  async getListAgentMembers(
    payload: ListAgentMembersFilterDto,
    agentId: string,
  ): Promise<{ agentMembers: AgentUser[] | []; pagemeta: Record<string, any> }> {
    const { agentRole } = payload;
    const matchStage: Record<string, any> = {
      isDeleted: false,
      agentId: new Types.ObjectId(agentId),
    };

    if (agentRole) {
      matchStage.agentRole = agentRole;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      { $sort: { createdAt: payload.order === QueryOrder.DESC ? -1 : 1 } },
      {
        $lookup: {
          from: USER_COLLECTION,
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $match: {
                isDeleted: false,
                ...(payload.search && {
                  $or: [
                    { username: { $regex: payload.search, $options: "i" } },
                    { firstName: { $regex: payload.search, $options: "i" } },
                    { lastName: { $regex: payload.search, $options: "i" } },
                    { phoneNumber: { $regex: payload.search, $options: "i" } },
                  ],
                }),
              },
            },
            {
              $project: {
                _id: 1,
                username: 1,
                firstName: 1,
                lastName: 1,
                phoneNumber: 1,
                role: 1,
                isChangedPassword: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
      {
        $match: {
          "user.0": { $exists: true },
        },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] },
        },
      },
    ];

    const countPipeline = [
      ...pipeline,
      {
        $count: "totalCount",
      },
    ];

    const [totalCountDetail] = await this.agentUserModel.aggregate(countPipeline).exec();

    let pagemeta: Record<string, any> = paginatingByCount(
      totalCountDetail?.totalCount || 0,
      payload.page ? payload.page : 0,
      payload.limit ? payload.limit : 0,
    );

    if (payload.limit && payload.page) {
      pipeline.push({ $limit: payload.limit });
      pipeline.push({ $skip: payload.skip });
    }

    const agentMembers = await this.agentUserModel.aggregate(pipeline).exec();

    return { pagemeta: pagemeta, agentMembers };
  }
}
