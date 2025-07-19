import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Card } from "./schema/card.schema";
import { CardCollaborator } from "./schema/card-collaborator.schema";
import { ListCollaboratorFilterDto } from "./dto/list-collaborator.dto";
import { QueryOrder } from "@src/_core/constants/common.constants";
import { ListCardsFilterDto } from "./dto/list-cards.dto";
import { paginatingByCount } from "@src/_core/helpers/common.helper";

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name)
    private readonly cardModel: Model<Card>,

    @InjectModel(CardCollaborator.name)
    private readonly cardCollaboratorModel: Model<CardCollaborator>,
  ) {}

  async getCollaborator(payload: {
    name: string;
    agentId: string;
  }): Promise<CardCollaborator | null> {
    const { name, agentId } = payload;

    const collaborator = await this.cardCollaboratorModel
      .findOne({ isDeleted: false, name, agentId })
      .exec();

    return collaborator ? collaborator.toObject() : null;
  }

  async createCollaborator(payload: { name: string; agentId: string }): Promise<CardCollaborator> {
    const { name, agentId } = payload;

    const newCollaborator = await this.cardCollaboratorModel.create({
      name,
      agentId,
    });

    return newCollaborator.toObject();
  }

  async listCollaborators(
    payload: ListCollaboratorFilterDto,
    agentId: string,
  ): Promise<CardCollaborator[]> {
    const { search } = payload;

    const query: Record<string, any> = {
      isDeleted: false,
      agentId,
    };

    if (search) {
      query.$or = [{ name: { $regex: new RegExp(search, "i") } }];
    }

    let mongooseQuery = this.cardCollaboratorModel.find(query);

    if (payload.order) {
      mongooseQuery = mongooseQuery.sort({ createdAt: payload.order === QueryOrder.DESC ? -1 : 1 });
    }

    if (payload.page && payload.limit) {
      mongooseQuery = mongooseQuery.skip(payload.skip);
      mongooseQuery = mongooseQuery.limit(payload.limit);
    }

    const collaborators = await mongooseQuery.exec();

    return collaborators.map((collaborator) => collaborator.toObject());
  }

  async getCard(payload: {
    name: string;
    bankCode: string;
    lastNumber: string;
    agentId: string;
  }): Promise<Card | null> {
    const { name, bankCode, lastNumber, agentId } = payload;
    const query: Record<string, any> = {
      isDeleted: false,
      agentId,
      bankCode,
      lastNumber,
      name,
    };
    const card = await this.cardModel.findOne(query).exec();

    return card ? card.toObject() : null;
  }
  async createCard(payload: {
    agentId: string;
    createdBy: string;
    name: string;
    bankCode: string;
    lastNumber: string;
    defaultFeePercent: number;
    feeBack: number;
    maturityDate?: Date;
    collaboratorId?: string;
  }): Promise<Card> {
    const {
      agentId,
      createdBy,
      name,
      bankCode,
      lastNumber,
      collaboratorId,
      feeBack,
      defaultFeePercent,
      maturityDate,
    } = payload;

    const newCard = await this.cardModel.create({
      agentId,
      createdBy,
      name,
      bankCode,
      lastNumber,
      defaultFeePercent: defaultFeePercent || 0,
      feeBack: feeBack || 0,
      maturityDate: maturityDate || null,
      collaboratorId,
    });

    return newCard.toObject();
  }

  async getListCards(
    payload: ListCardsFilterDto,
    agentId: string,
  ): Promise<{ cards: Card[] } & { pagemeta: Record<string, any> }> {
    const { search, isActive } = payload;

    const query: Record<string, any> = {
      isDeleted: false,
      agentId,
    };

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { bankCode: { $regex: new RegExp(search, "i") } },
        { lastNumber: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    let mongooseQuery = this.cardModel.find(query);

    if (payload.order) {
      mongooseQuery = mongooseQuery.sort({ createdAt: payload.order === QueryOrder.DESC ? -1 : 1 });
    }

    if (payload.page && payload.limit) {
      mongooseQuery = mongooseQuery.skip(payload.skip);
      mongooseQuery = mongooseQuery.limit(payload.limit);
    }

    const totalCountDetail = await this.cardModel.countDocuments(query).exec();

    let pagemeta: Record<string, any> = paginatingByCount(
      totalCountDetail || 0,
      payload.page ? payload.page : 0,
      payload.limit ? payload.limit : 0,
    );

    const cards = await mongooseQuery.exec();

    return {
      pagemeta,
      cards: cards.map((card) => card.toObject()),
    };
  }
}
