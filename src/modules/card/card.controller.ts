import { Controller, Get, HttpCode, HttpStatus, Query } from "@nestjs/common";
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
        total: collaborators.length,
        collaborators,
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
    const result = await this.cardService.getListCards(payload, agent._id.toString());

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "List of POS terminals retrieved successfully",
      data: {
        ...result,
      },
    });
  }
}
