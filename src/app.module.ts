import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "@/app.controller";
import { AppService } from "@/app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "@/modules/auth/auth.module";
import { UsersModule } from "@/modules/users/users.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { CatchAllFilter } from "./_core/filters/catch-all.filter";
import { AuthGuard } from "./modules/auth/guard/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { RolesGuard } from "./modules/auth/guard/role.guard";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { FileModule } from "./modules/file/file.module";
import { TerminusModule } from "@nestjs/terminus";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    // Config Module are imported here
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    // MongoDb Module are imported here
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>("MONGODB_URI") ||
          "mongodb://localhost:27017/an-management",
      }),
      inject: [ConfigService],
    }),

    // Event Emitter Module are imported here
    EventEmitterModule.forRoot({
      global: true,
    }),

    TerminusModule,

    // The Module are imported here
    AuthModule,
    UsersModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    // The Service are provided here
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

    // The Interceptor are provided here
    {
      provide: APP_FILTER,
      useClass: CatchAllFilter,
    },
  ],
})
// export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes("{*splat}");
  }
}
