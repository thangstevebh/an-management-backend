import { Module } from "@nestjs/common";
import { AgentController } from "./agent.controller";
import { AgentService } from "./agent.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Agent, AgentSchema } from "./schema/agent.schema";
import { AgentNote, AgentNoteSchema } from "./schema/agent-note.schema";
import { AgentUser, AgentUserSchema } from "./schema/user-agent.schema";

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
    ]),
  ],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
