import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from "@nestjs/common";
import { CardService } from "./card.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Roles } from "@src/_core/decorators/role.decorator";
import { IsAgentRequired } from "@src/_core/decorators/is-agent-required.decorator";
import { UserRole } from "../user/user.constant";
import { GetAgent } from "@src/_core/decorators/get-agent.decorator";
import { Agent } from "../agent/schema/agent.schema";
import { ListCollaboratorFilterDto } from "./dto/list-collaborator.dto";
import { ICommonResponse } from "@src/_core/interfaces/common.interface";
import { CommonResponse } from "@src/_core/helpers/common.helper";
import { ReturnStatus } from "@src/_core/constants/common.constants";
import { ListCardsFilterDto } from "./dto/list-cards.dto";
import { UpdateCardDto } from "./dto/update-card.dto";
import { GetUser } from "@src/_core/decorators/user.decorator";
import { IUserJWT } from "../auth/auth.interface";
import { UpdateCardDetailDto } from "./dto/update-card-detail.dto";
import { AgentRoles } from "@src/_core/decorators/agent-role.decorator";
import { AgentRole } from "../agent/agent.constant";
import { ListBillFilterDto } from "./dto/list-bills.dto";
import { DashboardReportsDto } from "./dto/dash-board-reports.dto";

@Controller("card")
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @ApiOperation({
    summary: "List Collaborators",
    description: "This endpoint retrieves a list of collaborators for a specific agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @Get("/list-collaborators")
  async listCollaborators(
    @GetAgent() agent: Agent,
    @Query() payload: ListCollaboratorFilterDto,
  ): Promise<ICommonResponse> {
    const collaborators = await this.cardService.listCollaborators(payload, agent._id.toString());

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "List of POS terminals retrieved successfully",
      data: {
        ...collaborators,
      },
    });
  }

  @ApiOperation({
    summary: "List Cards",
    description: "This endpoint retrieves a list of cards for a specific agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @Get("/list-cards")
  async listCards(
    @GetAgent() agent: Agent,
    @Query() payload: ListCardsFilterDto,
  ): Promise<ICommonResponse> {
    const result = await this.cardService.getListCards(
      payload,
      agent ? agent._id.toString() : null,
    );

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "List of cards retrieved successfully",
      data: {
        ...result,
      },
    });
  }

  @ApiOperation({
    summary: "Get Card By ID",
    description: "This endpoint retrieves a specific card by its ID for a specific agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @Get("/get-card-by-id")
  async getCardById(
    @GetAgent() agent: Agent,
    @Query("cardId") cardId: string,
  ): Promise<ICommonResponse> {
    const card = await this.cardService.getCardById({
      cardId,
      agentId: agent._id.toString(),
    });

    if (!card) {
      throw new BadRequestException("Card not found or does not belong to this agent");
    }

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Card retrieved successfully",
      data: {
        card,
      },
    });
  }

  @ApiOperation({
    summary: "Update Card By ID",
    description: "This endpoint updates a specific card by its ID for a specific agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @Patch("/update-card/:cardId")
  async updateCardById(
    @GetUser() user: IUserJWT,
    @GetAgent() agent: Agent,
    @Param("cardId") cardId: string,
    @Body() payload: UpdateCardDto,
  ): Promise<ICommonResponse> {
    const card = await this.cardService.getCardById({
      cardId,
      agentId: agent._id.toString(),
    });

    if (!card) {
      throw new BadRequestException("Card not found or does not belong to this agent");
    }

    if (user.role !== UserRole.ADMIN && payload.agentId) {
      payload.agentId = undefined;
    }

    if (payload.agentId === agent._id.toString()) {
      payload.agentId = undefined;
    }

    const updated = await this.cardService.updateCard(cardId, payload);

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Card updated successfully",
      data: {
        card: updated,
      },
    });
  }

  @ApiOperation({
    summary: "Update Card Detail By ID",
    description:
      "This endpoint updates the details of a specific card by its ID for a specific agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @AgentRoles(AgentRole.OWNER, AgentRole.MANAGER)
  @IsAgentRequired()
  @Patch("/update-card-detail/:cardId/:cardDetailId")
  async updateCardDetailById(
    @GetUser() user: IUserJWT,
    @GetAgent() agent: Agent,
    @Param("cardId") cardId: string,
    @Param("cardDetailId") cardDetailId: string,
    @Body() payload: UpdateCardDetailDto,
  ): Promise<ICommonResponse> {
    const card = await this.cardService.getCardById({
      cardId: cardId.toString(),
      agentId: agent._id.toString(),
    });

    if (!card) {
      throw new BadRequestException("Card not found or does not belong to this agent");
    }

    if (user.role !== UserRole.ADMIN) {
      payload.amount = undefined;
      payload.withdrawedAmount = undefined;
    }

    const updated = await this.cardService.updateCardDetail(cardId, cardDetailId, payload);

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Card details updated successfully",
      data: {
        card: updated,
      },
    });
  }

  @ApiOperation({
    summary: "List Bills",
    description:
      "This endpoint retrieves a list of bills for a specific agent based on the provided filters.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @Get("/get-bills")
  async listBills(
    @GetUser() user: IUserJWT,
    @GetAgent() agent: Agent,
    @Query() payload: ListBillFilterDto,
  ): Promise<ICommonResponse> {
    const queryPayload = payload;
    const bills = await this.cardService.getListBills(queryPayload);
    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "List of bills retrieved successfully",
      data: {
        ...bills,
      },
    });
  }

  @ApiOperation({
    summary: "Get Dashboard Reports",
    description:
      "This endpoint retrieves dashboard reports for a specific agent, including total cards, total bills, and total collaborators.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @Get("/get-dashboard-reports")
  async getDashboardReports(
    @GetUser() user: IUserJWT,
    @GetAgent() agent: Agent,
    @Query() payload: DashboardReportsDto,
  ): Promise<ICommonResponse> {
    /*
     * get total count of bills in current month, current day
     * get total amount of bills in current month, current day
     * get total amount of fee, feePerDay, feeBack, feeDifference in current month, current day
     * */
    const totalBills = await this.cardService.getTotalBills({
      agentId: agent._id.toString(),
      startDate: payload.startDate ? payload.startDate : new Date(),
      endDate: payload.endDate ? payload.endDate : new Date(),
      cardId: payload.cardId ? payload.cardId.trim() : undefined,
    });

    /*
     * get total amount negative remaining amount of cards in current month, current day
     * */
    const totalCardDetail = await this.cardService.getTotalDetailAmount({
      agentId: agent._id.toString(),
      startDate: payload.startDate ? payload.startDate : new Date(),
      endDate: payload.endDate ? payload.endDate : new Date(),
      cardId: payload.cardId ? payload.cardId.trim() : undefined,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Dashboard reports retrieved successfully",
      data: {
        totalBills: totalBills,
        totalCardDetail: totalCardDetail,
      },
    });
  }
}
