import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, PipelineStage, Types } from "mongoose";
import { Card } from "./schema/card.schema";
import { CARD_COLLABORATOR_COLLECTION, CardCollaborator } from "./schema/card-collaborator.schema";
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
import { CardBill } from "./schema/card-bill.schema";
import { UpdateCardDto } from "./dto/update-card.dto";
import { UpdateCardDetailDto } from "./dto/update-card-detail.dto";

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

    @InjectModel(CardBill.name)
    private readonly cardBillModel: Model<CardBill>,

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
  ): Promise<{ collaborators: CardCollaborator[] | []; pagemeta: Record<string, any> }> {
    const { search, name } = payload;

    const query: Record<string, any> = {
      isDeleted: false,
      agentId,
    };

    if (payload._id) {
      query._id = new Types.ObjectId(payload._id);
    }

    if (name) {
      query.name = name;
    }

    if (search) {
      query.$or = [{ name: { $regex: new RegExp(search, "i") } }];
    }

    let mongooseQuery = this.cardCollaboratorModel.find(query);
    const totalCountDetail = await this.cardCollaboratorModel.countDocuments(query).exec();

    if (payload.order) {
      mongooseQuery = mongooseQuery.sort({ createdAt: payload.order === QueryOrder.DESC ? -1 : 1 });
    }

    if (payload.page && payload.limit) {
      mongooseQuery = mongooseQuery.skip(payload.skip);
      mongooseQuery = mongooseQuery.limit(payload.limit);
    }

    const collaborators = await mongooseQuery.exec();

    let pagemeta: Record<string, any> = paginatingByCount(
      totalCountDetail || 0,
      payload.page ? payload.page : 0,
      payload.limit ? payload.limit : 0,
    );

    return {
      collaborators: collaborators.map((collaborator) => collaborator.toObject()),
      pagemeta,
    };
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
    cardCollaboratorId?: string;
  }): Promise<Card | null> {
    const {
      agentId,
      createdBy,
      name,
      bankCode,
      lastNumber,
      cardCollaboratorId,
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
        cardCollaboratorId,
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
        negativeRemainingAmount: 0,
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
    agentId?: string | null,
  ): Promise<{ cards: Card[] } & { pagemeta: Record<string, any> }> {
    const { search, isActive } = payload;

    const query: Record<string, any> = {
      isDeleted: false,
    };

    if (agentId) {
      query.agentId = new Types.ObjectId(agentId);
    }

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

    let mongooseQuery = this.cardModel.find(query).populate("cardCollaboratorId");

    if (payload.order) {
      mongooseQuery = mongooseQuery.sort({ name: payload.order === QueryOrder.DESC ? -1 : 1 });
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
        currentDetail?: CardDetail | null;
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
        $lookup: {
          from: CARD_COLLABORATOR_COLLECTION,
          localField: "cardCollaboratorId",
          foreignField: "_id",
          as: "collaborator",
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
          currentDetail: {
            $cond: {
              if: { $gt: [{ $size: "$currentDetail" }, 0] },
              then: { $arrayElemAt: ["$currentDetail", 0] },
              else: null,
            },
          },
        },
      },
      {
        $addFields: {
          collaborator: {
            $cond: {
              if: { $gt: [{ $size: "$collaborator" }, 0] },
              then: { $arrayElemAt: ["$collaborator", 0] },
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

          // cardDetail.negativeRemainingAmount =
          //   Number(cardDetail.amount) - Number(cardDetail.withdrawedAmount) < 0
          //     ? Number(cardDetail.amount) - Number(cardDetail.withdrawedAmount)
          //     : 0;

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

          // cardDetail.negativeRemainingAmount =
          //   Number(cardDetail.amount) - Number(cardDetail.withdrawedAmount) < 0
          //     ? Number(cardDetail.amount) - Number(cardDetail.withdrawedAmount)
          //     : 0;

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

  async addBillByCard(payload: {
    posTerminalId: string;
    posTerminalName: string;
    agentId: string;
    createdBy: string;
    amount: number;
    billNumber: string;
    customerFee: number;
    posFee: number;
    backFee: number;
    cardId: string;
    lot?: string;
    note?: string;
  }): Promise<CardBill | null> {
    const {
      posTerminalId,
      posTerminalName,
      amount,
      lot,
      billNumber,
      note,
      customerFee,
      cardId,
      backFee,
      posFee,
      agentId,
      createdBy,
    } = payload;
    console.log("Adding bill by card", payload);

    const differenceFee = customerFee - posFee;

    const customerFeeAmount = (amount * customerFee) / 100;
    const posFeeAmount = (amount * posFee) / 100;
    const backFeeAmount = (amount * backFee) / 100;
    const differenceFeeAmount = (amount * differenceFee) / 100;

    const newBill = await this.cardBillModel.create({
      posTerminalId: new Types.ObjectId(posTerminalId),
      posTerminalName,
      agentId: new Types.ObjectId(agentId),
      createdBy: new Types.ObjectId(createdBy),

      lot: lot ? lot.trim() : null,
      billNumber: billNumber.trim(),

      amount: new Decimal(amount || 0),

      customerFee: customerFee || 0,
      customerFeeAmount: new Decimal(customerFeeAmount) || 0,

      posFee: posFee || 0,
      posFeeAmount: new Decimal(posFeeAmount) || 0,

      backFee: backFee || 0,
      backFeeAmount: new Decimal(backFeeAmount) || 0,

      differenceFee: differenceFee || 0,
      differenceFeeAmount: new Decimal(differenceFeeAmount) || 0,

      cardId: new Types.ObjectId(cardId),
      note: note ? note.trim() : null,
    });

    return newBill ? newBill.toObject() : null;
  }
  async updateNegativeCurrentCardDetail(payload: {
    cardId: string;
    agentId: string;
    negativeAmount: number;
    note?: string;
  }): Promise<CardDetail | null> {
    const { cardId, negativeAmount } = payload;

    const cardDetail = await this.cardDetailModel.findOne({
      cardId: new Types.ObjectId(cardId),
      isCurrent: true,
      isDeleted: false,
    });

    if (!cardDetail) {
      return null;
    }

    cardDetail.negativeRemainingAmount = Number(negativeAmount || 0);

    await cardDetail.save();

    return cardDetail.toObject();
  }

  async updateCard(cardId: string, payload: UpdateCardDto) {
    const query: Record<string, any> = {
      isDeleted: false,
      _id: new Types.ObjectId(cardId),
    };
    const updateData: Record<string, any> = {};
    if (payload.name) updateData.name = payload.name.trim();
    if (payload.bankCode) updateData.bankCode = payload.bankCode.trim();
    if (payload.lastNumber) updateData.lastNumber = payload.lastNumber.trim();
    if (payload.defaultFeePercent) {
      updateData.defaultFeePercent = new Decimal(payload.defaultFeePercent);
    }
    if (payload.feeBack) {
      updateData.feeBack = new Decimal(payload.feeBack);
    }
    if (payload.maturityDate) {
      updateData.maturityDate = payload.maturityDate;
    }
    if (payload.note) {
      updateData.note = payload.note.trim();
    }
    if (payload.agentId) {
      updateData.agentId = new Types.ObjectId(payload.agentId);
    }
    if (payload.cardCollaboratorId) {
      updateData.cardCollaboratorId = new Types.ObjectId(payload.cardCollaboratorId);
    }
    const updatedCard = await this.cardModel
      .findOneAndUpdate(query, { ...updateData }, { new: true })
      .exec();
    if (!updatedCard) {
      throw new Error("Card not found or does not belong to this agent");
    }

    return updatedCard.toObject();
  }

  async updateCardDetail(cardId: string, cardDetailId: string, payload: UpdateCardDetailDto) {
    const query: Record<string, any> = {
      isDeleted: false,
      _id: new Types.ObjectId(cardDetailId),
      cardId: new Types.ObjectId(cardId),
      isCurrent: true,
    };

    const updateData: Record<string, any> = {};
    if (payload.feePercent) {
      updateData.feePercent = new Decimal(payload.feePercent);
    }
    if (payload.amount) {
      updateData.amount = new Decimal(payload.amount);
    }
    if (payload.notWithdrawAmount) {
      updateData.notWithdrawAmount = new Decimal(payload.notWithdrawAmount);
    }
    if (payload.withdrawedAmount) {
      updateData.withdrawedAmount = new Decimal(payload.withdrawedAmount);
    }
    if (payload.negativeRemainingAmount) {
      updateData.negativeRemainingAmount = new Decimal(payload.negativeRemainingAmount);
    }
    if (payload.detail) {
      updateData.detail = payload.detail.trim();
    }
    const updatedCardDetail = await this.cardDetailModel
      .findOneAndUpdate(query, { $set: { ...updateData } }, { new: true })
      .exec();
    if (!updatedCardDetail) {
      throw new Error("Card detail not found or does not belong to this card");
    }

    return updatedCardDetail.toObject();
  }
}
