import { Module } from "@nestjs/common";
import { AgentController } from "./agent.controller";
import { AgentService } from "./agent.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Agent, AgentSchema } from "./schema/agent.schema";
import { AgentNote, AgentNoteSchema } from "./schema/agent-note.schema";
import { AgentUser, AgentUserSchema } from "./schema/user-agent.schema";
import { UserModule } from "../user/user.module";
import { User, UserSchema } from "../user/schema/user.schema";
import { PosTerminalModule } from "../pos-terminal/pos-terminal.module";
import { CardModule } from "../card/card.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Agent.name,
        schema: AgentSchema,
      },
      {
        name: AgentNote.name,
        schema: AgentNoteSchema,
      },
      {
        name: AgentUser.name,
        schema: AgentUserSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),

    UserModule,
    PosTerminalModule,
    CardModule,
  ],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
