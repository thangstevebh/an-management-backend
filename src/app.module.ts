import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BankModule } from './modules/bank/bank.module';

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

    UserModule,
    AuthModule,
    BankModule,
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
