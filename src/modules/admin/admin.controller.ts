import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { Roles } from "@src/_core/decorators/role.decorator";
import { UserRole } from "../user/user.constant";
import { GetUser } from "@src/_core/decorators/user.decorator";
import { User } from "../user/schema/user.schema";
import { AddPosTerminalDto } from "../agent/dto/add-pos-terminal.dto";
import { ICommonResponse } from "@src/_core/interfaces/common.interface";
import { CommonResponse } from "@src/_core/helpers/common.helper";
import { ReturnStatus } from "@src/_core/constants/common.constants";
import { PosTerminalService } from "../pos-terminal/pos-terminal.service";
import { CardService } from "../card/card.service";
import { ConfirmIncommingCommandDto } from "./dto/confirm-incomming-command.dto";
import { InCommingCommandStatus, WithdrawCommandStatus } from "../card/card.constant";
import { ConfirmWithdrawCommandDto } from "./dto/confirm-withdraw-command.dto";
import { ListPOSFilterDto } from "../agent/dto/list-pos.dto";

@Controller("admin")
export class AdminController {
  constructor(
    private readonly posTerminalService: PosTerminalService,
    private cardService: CardService,
  ) {}

  @ApiOperation({
    summary: "Add Agent POS Terminal",
    description: "This endpoint allows an agent to add a POS terminal.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  // @IsAgentRequired()
  @Post("/add-pos-terminal")
  async addPosTerminal(
    @GetUser() user: User,
    @Body() payload: AddPosTerminalDto,
  ): Promise<ICommonResponse> {
    const { name } = payload;

    const exitingPosTerminal = await this.posTerminalService.getPosTerminal({
      name,
    });

    if (exitingPosTerminal) {
      throw new BadRequestException("POS terminal already exists for this agent");
    }

    const newPosTerminal = await this.posTerminalService.createPosTerminal({
      createdBy: user._id.toString(),
      ...payload,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Agent POS terminal added successfully",
      data: {
        posTerminal: newPosTerminal,
      },
    });
  }

  @ApiOperation({
    summary: "Confirm Incomming Command",
    description: "This endpoint allows an agent to confirm an incoming command for Card.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @Post("/confirm-incomming-command/:cardId")
  async confirmIncommingCommand(
    @GetUser() user: User,
    @Param("cardId") cardId: string,
    @Body() payload: ConfirmIncommingCommandDto,
  ): Promise<ICommonResponse> {
    const { confirmCommandId, status, code, note } = payload;

    if (payload.status === InCommingCommandStatus.PENDING) {
      throw new BadRequestException("Cannot confirm command with status PENDING");
    }

    const checkValidCommand = await this.cardService.checkIncommingCommandById({
      commandId: confirmCommandId,
      cardId: cardId.toString(),
      status: InCommingCommandStatus.PENDING,
      code,
    });

    if (!checkValidCommand) {
      throw new BadRequestException("Invalid command ID or command is not pending");
    }

    const checkValidCard = await this.cardService.getCardById({
      cardId,
      agentId: checkValidCommand.agentId.toString(),
    });

    if (!checkValidCard) {
      throw new BadRequestException("Card not found or does not belong to this agent");
    }

    if (!checkValidCard.currentDetail) {
      throw new BadRequestException("Card does not have current detail");
    }

    if (checkValidCard.currentDetail.endDate !== null) {
      throw new BadRequestException("Card is already expired, cannot confirm command");
    }

    const updatedCommand = await this.cardService.confirmIncommingCommand({
      commandId: confirmCommandId,
      cardId: cardId.toString(),
      status,
      code,
      note,
      confirmedBy: user._id.toString(),
      incommingAmount: checkValidCommand.incommingAmount,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Incomming command confirmed successfully",
      data: {
        command: updatedCommand,
      },
    });
  }

  @ApiOperation({
    summary: "Confirm Withdraw Command",
    description: "This endpoint allows an agent to confirm an withdraw command for Card.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @Post("/confirm-withdraw-command/:cardId")
  async confirmWithdrawCommand(
    @GetUser() user: User,
    @Param("cardId") cardId: string,
    @Body() payload: ConfirmWithdrawCommandDto,
  ): Promise<ICommonResponse> {
    const { confirmCommandId, status, code, note } = payload;

    if (payload.status === WithdrawCommandStatus.PENDING) {
      throw new BadRequestException("Cannot confirm command with status PENDING");
    }

    const checkValidCommand = await this.cardService.checkWithdrawCommandById({
      commandId: confirmCommandId,
      cardId: cardId.toString(),
      status: InCommingCommandStatus.PENDING,
      code,
    });

    if (!checkValidCommand) {
      throw new BadRequestException("Invalid command ID or command is not pending");
    }

    const checkValidCard = await this.cardService.getCardById({
      cardId,
      agentId: checkValidCommand.agentId.toString(),
    });

    if (!checkValidCard) {
      throw new BadRequestException("Card not found or does not belong to this agent");
    }

    if (!checkValidCard.currentDetail) {
      throw new BadRequestException("Card does not have current detail");
    }

    if (checkValidCard.currentDetail.endDate !== null) {
      throw new BadRequestException("Card is already expired, cannot confirm command");
    }

    const updateCommand = await this.cardService.confirmWithdrawCommand({
      commandId: confirmCommandId,
      cardId: cardId.toString(),
      status,
      code,
      note,
      confirmedBy: user._id.toString(),
      withdrawRequestedAmount: checkValidCommand.withdrawRequestedAmount,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Withdraw command confirmed successfully",
      data: {
        command: updateCommand,
      },
    });
  }

  @ApiOperation({
    summary: "List POS Terminals",
    description: "This endpoint retrieves a list of POS terminals for an agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN)
  @Get("/list-pos-by-admin")
  async listPOSByAdmin(
    @Req() req: Request,
    @Query() payload: ListPOSFilterDto,
  ): Promise<ICommonResponse> {
    const posTerminals = await this.posTerminalService.getListPosTerminals(payload);

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "List of POS terminals retrieved successfully",
      data: {
        ...posTerminals,
      },
    });
  }
}
