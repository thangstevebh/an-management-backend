import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { TerminusModule } from "@nestjs/terminus";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    // Config Module are imported here
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // Event Emitter Module are imported here
    EventEmitterModule.forRoot({
      global: true,
    }),

    /*
     * MongoDB Module are imported here
     * */
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>("DB_URI") ||
          "mongodb://localhost:27017/an-management",
      }),
      inject: [ConfigService],
    }),

    TerminusModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
