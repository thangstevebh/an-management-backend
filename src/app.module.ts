import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BankModule } from "./modules/bank/bank.module";
import { AgentModule } from "./modules/agent/agent.module";
import { PosTerminalModule } from "./modules/pos-terminal/pos-terminal.module";
import { CardModule } from "./modules/card/card.module";
import { DebtModule } from "./modules/debt/debt.module";
import { CorrespondentModule } from "./modules/correspondent/correspondent.module";
import { APP_FILTER } from "@nestjs/core";
import { CatchAllFilter } from "./_core/filters/catch-all.filter";
import { RolesGuard } from "./modules/auth/guard/role.guard";
import { AuthGuard } from "./modules/auth/guard/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { AgentRequiredGuard } from "./modules/auth/guard/agent-required.guard";
import { AgentRolesGuard } from "./modules/auth/guard/agent-role.guard";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),

    // Event Emitter Module are imported here
    EventEmitterModule.forRoot({
      global: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("DB_URI") || "mongodb://localhost:27017/an-management",
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    AdminModule,
    UserModule,
    BankModule,
    AgentModule,
    PosTerminalModule,
    CardModule,
    DebtModule,
    CorrespondentModule,
  ],
  controllers: [AppController],

  providers: [
    AppService,
    JwtService,

    // The Guard are provided here
    {
      provide: "APP_GUARD",
      useClass: AuthGuard,
    },
    {
      provide: "APP_GUARD",
      useClass: RolesGuard,
    },
    {
      provide: "APP_GUARD",
      useClass: AgentRequiredGuard,
    },
    {
      provide: "APP_GUARD",
      useClass: AgentRolesGuard,
    },

    // The Interceptor are provided here
    {
      provide: APP_FILTER,
      useClass: CatchAllFilter,
    },
  ],
})
export class AppModule {}
