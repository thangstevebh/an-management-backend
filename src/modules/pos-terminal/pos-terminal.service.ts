import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PosTerminal } from "./schema/pos-terminal.schema";
import { Model, Types } from "mongoose";
import { AddPosTerminalDto } from "../agent/dto/add-pos-terminal.dto";
import { PosTerminalStatus } from "./pos-terminal.constant";
import { ListPOSFilterDto } from "../agent/dto/list-pos.dto";
import { QueryOrder } from "@src/_core/constants/common.constants";
import { paginatingByCount } from "@src/_core/helpers/common.helper";

@Injectable()
export class PosTerminalService {
  constructor(
    @InjectModel(PosTerminal.name)
    private readonly posTerminalModel: Model<PosTerminal>,
  ) {}

  async getPosTerminal(payload: { name: string; agentId?: string }): Promise<PosTerminal | null> {
    const { name, agentId } = payload;

    const query: Record<string, any> = { isDeleted: false };
    if (name) {
      query.name = name;
    }
    if (agentId) {
      query.agentId = agentId;
    }
    const posTerminal = await this.posTerminalModel.findOne(query).exec();

    return posTerminal ? posTerminal.toObject() : null;
  }

  async getPosTerminalById(payload: {
    posTerminalId: string;
    agentId?: string;
  }): Promise<PosTerminal | null> {
    const { posTerminalId, agentId } = payload;

    const query: Record<string, any> = { isDeleted: false, _id: new Types.ObjectId(posTerminalId) };

    if (agentId) {
      query.agentId = new Types.ObjectId(agentId);
    }
    const posTerminal = await this.posTerminalModel.findOne(query).exec();

    return posTerminal ? posTerminal.toObject() : null;
  }

  async updatePosTerminal(payload: {
    posTerminalId: string;
    agentId?: string;
    name?: string;
    status?: PosTerminalStatus;
    feePerDay?: number;
    feeBack?: number;
    feePerTerminal?: number;
    posType?: string;
    feePercentNormal?: number;
    feePercentMB?: number;
    note?: string;
  }): Promise<PosTerminal | null> {
    const { posTerminalId, agentId, name, status, feePerDay, feeBack, feePerTerminal, posType } =
      payload;

    const query: Record<string, any> = { isDeleted: false, _id: new Types.ObjectId(posTerminalId) };

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status;
    if (feePerDay) updateData.feePerDay = feePerDay;
    if (feeBack) updateData.feeBack = feeBack;
    if (feePerTerminal) updateData.feePerTerminal = feePerTerminal;
    if (posType) updateData.posType = posType;
    if (name) updateData.name = name;
    if (agentId) updateData.agentId = new Types.ObjectId(agentId);
    if (payload.feePercentNormal) {
      updateData.feePercentNormal = payload.feePercentNormal;
    }
    if (payload.feePercentMB) {
      updateData.feePercentMB = payload.feePercentMB;
    }
    if (payload.note) {
      updateData.note = payload.note;
    }

    const updatedPosTerminal = await this.posTerminalModel
      .findOneAndUpdate(query, updateData, { new: true })
      .exec();

    return updatedPosTerminal ? updatedPosTerminal.toObject() : null;
  }

  async createPosTerminal(
    payload: AddPosTerminalDto & {
      createdBy?: string | null;
    },
  ): Promise<PosTerminal> {
    const { name, createdBy, agentId, feePerDay, feeBack, feePerTerminal, posType } = payload;

    const newPosTerminal = new this.posTerminalModel({
      name,
      agentId,
      feePerDay,
      feeBack,
      feePerTerminal,
      createdBy,
      posType,
    });

    await newPosTerminal.save();

    return newPosTerminal.toObject();
  }

  async getListPosTerminals(
    payload: ListPOSFilterDto,
    agentId?: string | null,
  ): Promise<{ posTerminals: PosTerminal[]; pagemeta: Record<string, any> }> {
    const query: Record<string, any> = { isDeleted: false };

    if (agentId) {
      query.agentId = new Types.ObjectId(agentId);
    }

    if (payload.agentId) {
      query.agentId = new Types.ObjectId(payload.agentId);
    }

    if (payload._id) {
      query._id = new Types.ObjectId(payload._id);
    }

    if (payload.status) {
      query.status = payload.status;
    }

    if (payload.search) {
      query.$or = [{ name: { $regex: new RegExp(payload.search, "i") } }];
    }

    let mongooseQuery = this.posTerminalModel.find(query);

    if (payload.order) {
      mongooseQuery = mongooseQuery.sort({ createdAt: payload.order === QueryOrder.DESC ? -1 : 1 });
    }

    if (payload.page && payload.limit) {
      mongooseQuery = mongooseQuery.skip(payload.skip);
      mongooseQuery = mongooseQuery.limit(payload.limit);
    }

    const posTerminals = await mongooseQuery.exec();

    const totalCountDetail = await this.posTerminalModel.countDocuments(query).exec();
    let pagemeta: Record<string, any> = paginatingByCount(
      totalCountDetail || 0,
      payload.page ? payload.page : 0,
      payload.limit ? payload.limit : 0,
    );

    return {
      pagemeta,
      posTerminals: posTerminals.map((posTerminal) => posTerminal.toObject()),
    };
  }
}
