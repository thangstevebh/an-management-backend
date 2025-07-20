import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, PipelineStage, Types } from "mongoose";
import { Card } from "./schema/card.schema";
import { CardCollaborator } from "./schema/card-collaborator.schema";
import { ListCollaboratorFilterDto } from "./dto/list-collaborator.dto";
import { QueryOrder } from "@src/_core/constants/common.constants";
import { ListCardsFilterDto } from "./dto/list-cards.dto";
import { paginatingByCount } from "@src/_core/helpers/common.helper";
import { AddCardDetailDto } from "./dto/add-card-detail.dto";
import { CARD_DETAIL_COLLECTION, CardDetail } from "./schema/card-detail.schema";
import { CardWithdrawCommand } from "./schema/card-withdraw-request.schema";
import { CardIncomingCommand } from "./schema/card-incomming-command.schema";
import { InCommingCommandStatus, WithdrawCommandStatus } from "./card.constant";
import Decimal from "decimal.js";
import { runInTransaction } from "@src/_core/helpers/transaction-session-mongoose.helper";

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name)
    private readonly cardModel: Model<Card>,

    @InjectModel(CardCollaborator.name)
    private readonly cardCollaboratorModel: Model<CardCollaborator>,

    @InjectModel(CardDetail.name)
    private readonly cardDetailModel: Model<CardDetail>,

    @InjectModel(CardIncomingCommand.name)
    private readonly cardIncomingCommandModel: Model<CardIncomingCommand>,

    @InjectModel(CardWithdrawCommand.name)
    private readonly cardWithdrawCommandModel: Model<CardWithdrawCommand>,

    @InjectConnection() private readonly connection: Connection,
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

  async checkCardByAgent(payload: { cardId: string; agentId: string }): Promise<Card | null> {
    const { cardId, agentId } = payload;
    const query: Record<string, any> = {
      isDeleted: false,
      agentId: new Types.ObjectId(agentId),
      _id: new Types.ObjectId(cardId),
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
  }): Promise<Card | null> {
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

    await runInTransaction(this.connection, async (session) => {
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

      /*
       * create default card detail
       * */
      await this.addCardDetail({
        cardId: newCard._id.toString(),
        agentId,
        feePercent: newCard.defaultFeePercent || 0,
        amount: 0,
        notWithdrawAmount: 0,
        withdrawedAmount: 0,
        negativeAmount: 0,
      });
    });

    const newCard = await this.cardModel.findOne({
      agentId: new Types.ObjectId(agentId),
      name,
      bankCode,
      lastNumber,
    });

    return newCard ? newCard.toObject() : null;
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

  async getCardById(payload: { cardId: string; agentId: string }): Promise<
    | (Card & {
        currentDetail: CardDetail;
      })
    | null
  > {
    const { cardId, agentId } = payload;

    const matchStage: Record<string, any> = {
      isDeleted: false,
      isActive: true,
      agentId: new Types.ObjectId(agentId),
      _id: new Types.ObjectId(cardId),
    };

    const pipeline: PipelineStage[] = [
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: CARD_DETAIL_COLLECTION,
          localField: "_id",
          foreignField: "cardId",
          as: "currentDetail",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$isDeleted", false] },
                    { $eq: ["$isCurrent", true] },
                    { $eq: ["$endDate", null] },
                  ],
                },
              },
            },
            { $sort: { fromDate: -1 } }, // Sort by fromDate descending
            { $limit: 1 }, // Get the most recent detail
          ],
        },
      },
      {
        $addFields: {
          currentDetail: {
            $cond: {
              if: { $gt: [{ $size: "$currentDetail" }, 0] },
              then: { $arrayElemAt: ["$currentDetail", 0] },
              else: null,
            },
          },
        },
      },
    ];

    const [card] = await this.cardModel.aggregate(pipeline).exec();

    return card ? card : null;
  }

  async addCardDetail(
    payload: AddCardDetailDto & { cardId: string; agentId: string },
  ): Promise<CardDetail | null> {
    const { cardId, agentId, detail } = payload;

    await runInTransaction(this.connection, async (session) => {
      /*
       * if there is no current detail, we will update all current details to not current
       * */
      await this.cardDetailModel.updateMany(
        {
          isDeleted: false,
          cardId: new Types.ObjectId(cardId),
          isCurrent: true,
          endDate: null,
        },
        {
          $set: {
            isCurrent: false,
            endDate: new Date(),
          },
        },
      );

      /*
       * if there is a current detail, we will create new detail
       * */
      const newCardDetail = new this.cardDetailModel({
        cardId,
        detail,
        feePercent: payload.feePercent || 0,
        amount: payload.amount || 0,
        notWithdrawAmount: payload.notWithdrawAmount || 0,
        withdrawedAmount: payload.withdrawedAmount || 0,
        isCurrent: true,
        fromDate: new Date(),
      });

      newCardDetail.save();
    });

    const newCardDetail = await this.cardDetailModel.findOne({
      cardId: new Types.ObjectId(cardId),
      isCurrent: true,
      endDate: null,
      isDeleted: false,
    });

    return newCardDetail ? newCardDetail.toObject() : null;
  }

  async addIncomingCommand(payload: {
    cardId: string;
    incommingAmount: number;
    cardDetailId: string;
    agentId: string;
    note?: string;
    createdBy: string;
    atDate?: Date;
  }): Promise<CardIncomingCommand | null> {
    const { cardId, incommingAmount, note, createdBy, atDate } = payload;

    const newCommand = await this.cardIncomingCommandModel.create({
      cardId,
      code: `IC-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}-${Math.floor(Math.random() * 10000)}`,
      incommingAmount: incommingAmount || 0,
      note: note || null,
      createdBy,
      atDate: atDate || new Date(),
      cardDetailId: new Types.ObjectId(payload.cardDetailId),
      agentId: new Types.ObjectId(payload.agentId),
    });

    return newCommand ? newCommand.toObject() : null;
  }

  async addWithdrawCommand(payload: {
    cardId: string;
    withdrawRequestedAmount: number;
    cardDetailId: string;
    agentId: string;
    note?: string;
    createdBy: string;
    atDate?: Date;
  }): Promise<CardWithdrawCommand | null> {
    const { cardId, withdrawRequestedAmount, note, createdBy, atDate } = payload;

    const newRequest = await this.cardWithdrawCommandModel.create({
      cardId,
      code: `WR-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}-${Math.floor(Math.random() * 10000)}`,
      withdrawRequestedAmount: withdrawRequestedAmount || 0,
      note: note || null,
      createdBy,
      atDate: atDate || new Date(),
      cardDetailId: new Types.ObjectId(payload.cardDetailId),
      agentId: new Types.ObjectId(payload.agentId),
    });

    return newRequest ? newRequest.toObject() : null;
  }

  async checkIncommingCommandById(payload: {
    commandId: string;
    cardId: string;
    agentId?: string;
    status?: InCommingCommandStatus;
    code?: string;
  }): Promise<CardIncomingCommand | null> {
    const { commandId, agentId, cardId, status } = payload;

    const query: Record<string, any> = {
      _id: new Types.ObjectId(commandId),
      cardId: new Types.ObjectId(cardId),
      isDeleted: false,
    };

    if (payload.status) {
      query.status = status;
    }

    if (agentId) {
      query.agentId = new Types.ObjectId(agentId);
    }

    if (payload.code) {
      query.code = payload.code;
    }

    const command = await this.cardIncomingCommandModel.findOne(query).exec();

    return command ? command.toObject() : null;
  }

  async checkWithdrawCommandById(payload: {
    commandId: string;
    cardId: string;
    code?: string;
    agentId?: string;
    status?: string;
  }): Promise<CardWithdrawCommand | null> {
    const { commandId, agentId, cardId, status } = payload;

    const query: Record<string, any> = {
      _id: new Types.ObjectId(commandId),
      cardId: new Types.ObjectId(cardId),
      isDeleted: false,
    };
    if (payload.status) {
      query.status = status;
    }
    if (agentId) {
      query.agentId = new Types.ObjectId(agentId);
    }

    if (payload.code) {
      query.code = payload.code;
    }

    const command = await this.cardWithdrawCommandModel.findOne(query).exec();

    return command ? command.toObject() : null;
  }

  async confirmIncommingCommand(payload: {
    commandId: string;
    cardId: string;
    status: InCommingCommandStatus;
    confirmedBy: string;
    incommingAmount: number;
    code: string;
    note?: string;
  }): Promise<CardIncomingCommand | null> {
    const { commandId, cardId, status, code, note, confirmedBy, incommingAmount } = payload;

    await runInTransaction(this.connection, async (session) => {
      const updated = await this.cardIncomingCommandModel.updateOne(
        {
          _id: new Types.ObjectId(commandId),
          cardId: new Types.ObjectId(cardId),
          isDeleted: false,
          status: InCommingCommandStatus.PENDING,
          code: code,
        },
        {
          $set: {
            status,
            note: note ? note.trim() : null,
            isConfirmed: true,
            confirmedAt: Date.now(),
            confirmedBy: new Types.ObjectId(confirmedBy),
          },
        },
      );

      if (
        status === InCommingCommandStatus.APPROVED &&
        updated.matchedCount > 0 &&
        updated.modifiedCount > 0
      ) {
        const cardDetail = await this.cardDetailModel.findOne({
          cardId: new Types.ObjectId(cardId),
          isCurrent: true,
          isDeleted: false,
        });

        if (cardDetail) {
          cardDetail.amount = Number(cardDetail.amount) + Number(incommingAmount);

          cardDetail.negativeRemainingAmount =
            Number(cardDetail.amount) - Number(cardDetail.withdrawedAmount) < 0
              ? Number(cardDetail.amount) - Number(cardDetail.withdrawedAmount)
              : 0;

          await cardDetail.save();
        }
      }
    });

    const updatedCommand = await this.cardIncomingCommandModel.findOne({
      _id: new Types.ObjectId(commandId),
      cardId: new Types.ObjectId(cardId),
      isDeleted: false,
      code: code,
    });

    return updatedCommand ? updatedCommand.toObject() : null;
  }

  async confirmWithdrawCommand(payload: {
    commandId: string;
    cardId: string;
    status: WithdrawCommandStatus;
    confirmedBy: string;
    withdrawRequestedAmount: number;
    code: string;
    note?: string;
  }): Promise<CardWithdrawCommand | null> {
    const { commandId, cardId, status, code, note, confirmedBy, withdrawRequestedAmount } = payload;

    await runInTransaction(this.connection, async (session) => {
      const updated = await this.cardWithdrawCommandModel.updateOne(
        {
          _id: new Types.ObjectId(commandId),
          cardId: new Types.ObjectId(cardId),
          isDeleted: false,
          status: WithdrawCommandStatus.PENDING,
          code: code,
        },
        {
          $set: {
            status,
            note: note ? note.trim() : null,
            isConfirmed: true,
            confirmedAt: Date.now(),
            confirmedBy: new Types.ObjectId(confirmedBy),
          },
        },
      );

      if (
        status === WithdrawCommandStatus.APPROVED &&
        updated.matchedCount > 0 &&
        updated.modifiedCount > 0
      ) {
        const cardDetail = await this.cardDetailModel.findOne({
          cardId: new Types.ObjectId(cardId),
          isCurrent: true,
          isDeleted: false,
        });

        if (cardDetail) {
          cardDetail.withdrawedAmount =
            Number(cardDetail.withdrawedAmount) + Number(withdrawRequestedAmount);

          cardDetail.negativeRemainingAmount =
            Number(cardDetail.amount) - Number(cardDetail.withdrawedAmount) < 0
              ? Number(cardDetail.amount) - Number(cardDetail.withdrawedAmount)
              : 0;

          cardDetail.withdrawedDate = new Date();

          await cardDetail.save();
        }
      }
    });

    const updatedCommand = await this.cardWithdrawCommandModel.findOne({
      _id: new Types.ObjectId(commandId),
      cardId: new Types.ObjectId(cardId),
      isDeleted: false,
      code: code,
    });

    return updatedCommand ? updatedCommand.toObject() : null;
  }
}
