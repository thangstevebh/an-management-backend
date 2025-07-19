import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ReturnStatus } from "@src/_core/constants/common.constants";
import { Roles } from "@src/_core/decorators/role.decorator";
import { CommonResponse } from "@src/_core/helpers/common.helper";
import { ICommonResponse } from "@src/_core/interfaces/common.interface";
import { UserRole } from "../user/user.constant";
import { CreateAgentByAdminDto } from "./dto/create-agent-by-admin.dto";
import { UserService } from "../user/user.service";
import { AgentService } from "./agent.service";
import { ListAgentsFilterDto } from "./dto/list-agent.dto";
import { AgentRole } from "./agent.constant";
import { IsAgentRequired } from "@src/_core/decorators/is-agent-required.decorator";
import { AgentRoles } from "@src/_core/decorators/agent-role.decorator";
import { GetUser } from "@src/_core/decorators/user.decorator";
import { IUserJWT } from "../auth/auth.interface";
import { GetAgent } from "@src/_core/decorators/get-agent.decorator";
import { Agent } from "./schema/agent.schema";
import { AddAgentMemberDto } from "./dto/add-member-agent.dto";
import { ListAgentMembersFilterDto } from "./dto/list-agent-members.dto";
import { AddPosTerminalDto } from "./dto/add-pos-terminal.dto";
import { PosTerminalService } from "../pos-terminal/pos-terminal.service";
import { User } from "../user/schema/user.schema";
import { ListPOSFilterDto } from "./dto/list-pos.dto";
import { CardService } from "../card/card.service";
import { AddCollaboratorCardDto } from "./dto/add-collaborator-card.dto";
import { AddCardDto } from "./dto/add-card.dto";

@Controller("agent")
export class AgentController {
  constructor(
    private readonly userService: UserService,
    private readonly agentService: AgentService,
    private readonly posTerminalService: PosTerminalService,
    private readonly cardService: CardService,
  ) {}

  @ApiOperation({
    summary: "Create Agent by Admin",
    description: "This endpoint allows an admin to create an agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post("/create-agent-by-admin")
  async createAgentByAdmin(@Body() payload: CreateAgentByAdminDto): Promise<ICommonResponse> {
    const { username, firstName, lastName, phoneNumber, agentName } = payload;

    const existingUser = await this.userService.getUser({
      username,
      phoneNumber,
    });
    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const existingAgent = await this.agentService.getAgent({
      name: agentName,
    });
    if (existingAgent) {
      throw new BadRequestException("Agent already exists");
    }

    const newAgent = await this.agentService.createAgent({
      name: agentName,
      username,
      firstName,
      lastName,
      phoneNumber,
      agentRole: AgentRole.OWNER,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Agent created successfully by admin",
      data: {
        agent: newAgent,
      },
    });
  }

  @ApiOperation({
    summary: "List Agents",
    description: "This endpoint retrieves a list of agents.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get("/list-agents")
  async listAgents(@Query() payload: ListAgentsFilterDto): Promise<ICommonResponse> {
    const result = await this.agentService.getListAgents(payload);

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "List of agents retrieved successfully",
      data: {
        ...result,
      },
    });
  }

  @ApiOperation({
    summary: "Add Agent Member",
    description: "This endpoint allows an manager to add a member to an agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @AgentRoles(AgentRole.OWNER, AgentRole.MANAGER)
  @Post("/add-agent-member")
  async addAgentMember(
    @GetUser() user: IUserJWT,
    @GetAgent() agent: Agent,
    @Body() payload: AddAgentMemberDto,
  ): Promise<ICommonResponse> {
    const { username, firstName, lastName, phoneNumber, agentRole } = payload;
    const existingUser = await this.userService.getUser({
      username,
      phoneNumber,
    });

    if (existingUser) {
      throw new BadRequestException("User already exists");
    }

    const newMember = await this.agentService.addAgentMember({
      agentId: agent._id.toString(),
      username,
      firstName,
      lastName,
      phoneNumber,
      agentRole,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Agent member added successfully",
      data: {
        member: newMember,
      },
    });
  }

  @ApiOperation({
    summary: "List Agent Members",
    description: "This endpoint retrieves a list of members in an agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @Get("/list-agent-members")
  async listAgentMembers(
    @GetAgent() agent: Agent,
    @Query() payload: ListAgentMembersFilterDto,
  ): Promise<ICommonResponse> {
    const members = await this.agentService.getListAgentMembers(payload, agent._id.toString());
    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Agent member added successfully",
      data: {
        ...members,
      },
    });
  }

  @ApiOperation({
    summary: "Add Agent POS Terminal",
    description: "This endpoint allows an agent to add a POS terminal.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @AgentRoles(AgentRole.OWNER, AgentRole.MANAGER)
  @Post("/add-pos-terminal")
  async addPosTerminal(
    @GetUser() user: User,
    @GetAgent() agent: Agent,
    @Body() payload: AddPosTerminalDto,
  ): Promise<ICommonResponse> {
    const { name } = payload;

    const exitingPosTerminal = await this.posTerminalService.getPosTerminal({
      name,
      agentId: agent._id.toString(),
    });

    if (exitingPosTerminal) {
      throw new BadRequestException("POS terminal already exists for this agent");
    }

    const newPosTerminal = await this.posTerminalService.createPosTerminal({
      agentId: agent._id.toString(),
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
    summary: "List POS Terminals",
    description: "This endpoint retrieves a list of POS terminals for an agent.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @Get("/list-pos")
  async listPOS(
    @GetAgent() agent: Agent,
    @Query() payload: ListPOSFilterDto,
  ): Promise<ICommonResponse> {
    const posTerminals = await this.posTerminalService.getListPosTerminals(
      payload,
      agent._id.toString(),
    );
    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "List of POS terminals retrieved successfully",
      data: {
        ...posTerminals,
      },
    });
  }

  @ApiOperation({
    summary: "Add Collaborator Card",
    description: "This endpoint allows an agent to add a collaborator card.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @AgentRoles(AgentRole.OWNER, AgentRole.MANAGER)
  @Post("/add-collaborator-card")
  async addCollaboratorCard(
    @GetUser() user: User,
    @GetAgent() agent: Agent,
    @Body() payload: AddCollaboratorCardDto,
  ): Promise<ICommonResponse> {
    const { name } = payload;

    const existingCollaborator = await this.cardService.getCollaborator({
      name,
      agentId: agent._id.toString(),
    });

    if (existingCollaborator) {
      throw new BadRequestException("Collaborator card already exists for this agent");
    }

    const newCollaborator = await this.cardService.createCollaborator({
      agentId: agent._id.toString(),
      name,
    });

    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Collaborator card added successfully",
      data: {
        collaborator: newCollaborator,
      },
    });
  }

  @ApiOperation({
    summary: "Add Card",
    description: "This endpoint allows an agent to add a card.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @IsAgentRequired()
  @AgentRoles(AgentRole.OWNER, AgentRole.MANAGER)
  @Post("/add-card")
  async addCard(
    @GetUser() user: User,
    @GetAgent() agent: Agent,
    @Body() payload: AddCardDto,
  ): Promise<ICommonResponse> {
    const { name, bankCode, lastNumber } = payload;

    const existingCard = await this.cardService.getCard({
      name,
      bankCode,
      lastNumber,
      agentId: agent._id.toString(),
    });

    if (existingCard) {
      throw new BadRequestException("Card already exists for this agent");
    }
    const newCard = await this.cardService.createCard({
      agentId: agent._id.toString(),
      createdBy: user._id.toString(),
      ...payload,
    });
    return CommonResponse({
      code: HttpStatus.OK,
      status: ReturnStatus.SUCCESS,
      message: "Card added successfully",
      data: {
        card: newCard,
      },
    });
  }
}
