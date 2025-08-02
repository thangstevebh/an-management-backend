import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ReturnStatus } from "@src/_core/constants/common.constants";
import { GetAgentOptional } from "@src/_core/decorators/get-agent.decorator";
import { Roles } from "@src/_core/decorators/role.decorator";
import { GetUser } from "@src/_core/decorators/user.decorator";
import { CommonResponse } from "@src/_core/helpers/common.helper";
import { ICommonResponse } from "@src/_core/interfaces/common.interface";
import { UserRole } from "../user/user.constant";
import { User } from "../user/schema/user.schema";
import { PosTerminalService } from "./pos-terminal.service";
import { UpdatePosTerminalDto } from "./dto/update-pos-terminal.dto";
import { UserService } from "../user/user.service";
import { AgentRole } from "../agent/agent.constant";
import { agent } from "supertest";

@Controller("pos-terminal")
export class PosTerminalController {
  constructor(
    private readonly posTerminalService: PosTerminalService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: "Update POS Terminal",
    description: "This endpoint allows an agent to update a POS terminal.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Patch("/update-pos-terminal/:posTerminalId")
  async updatePosTerminal(
    @GetUser() user: User,
    @Body() payload: UpdatePosTerminalDto,
    @Param("posTerminalId") posTerminalId: string,
    @GetAgentOptional() agentId: string,
  ): Promise<ICommonResponse> {
    if (user.role !== UserRole.ADMIN && !agentId) {
      throw new BadRequestException("Agent ID is required for non-admin users");
    }

    if (user.role !== UserRole.ADMIN && agentId) {
      /*
       * Check user permission in agent
       * */
      const checkUserAgentRole = await this.userService.getUserAgent({
        _id: user._id.toString(),
        agentId: agentId,
      });
      if (!checkUserAgentRole) {
        throw new BadRequestException("User does not have permission in this agent");
      }
      if (checkUserAgentRole.agentUser && checkUserAgentRole.agentUser.length <= 0) {
        throw new BadRequestException("User does not have permission in this agent");
      }

      const agentRoles = checkUserAgentRole.agentUser
        ? checkUserAgentRole.agentUser.map((item) => item.agentRole)
        : [];
      if (agentRoles.includes(AgentRole.MEMBER)) {
        throw new BadRequestException("User does not have permission to update POS terminal");
      }
    }

    const existingPosTerminal = await this.posTerminalService.getPosTerminalById({
      posTerminalId,
      agentId: agentId,
    });

    if (!existingPosTerminal) {
      throw new BadRequestException("POS terminal not found");
    }

    const updatedPosTerminal = await this.posTerminalService.updatePosTerminal({
      posTerminalId,
      agentId: payload.agentId,
      name: payload.name,
      status: payload.status,
      feePerDay: payload.feePerDay,
      feeBack: payload.feeBack,
      feePerTerminal: payload.feePerTerminal,
      posType: payload.posType,
      feePercentNormal: payload.feePercentNormal,
      feePercentMB: payload.feePercentMB,
      note: payload.note,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "POS Terminal updated successfully",
      data: {
        posTerminal: updatedPosTerminal,
      },
    });
  }
}
