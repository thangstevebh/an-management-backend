import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { AgentModule } from "../agent/agent.module";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "CsIBuHFJnWiQxnMuNisVquJChFawEEKK",
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    UserModule,
    AgentModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
