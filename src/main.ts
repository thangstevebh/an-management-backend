import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import {
  ConsoleLogger,
  ForbiddenException,
  Logger,
  ValidationPipe,
} from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import { json, urlencoded } from "express";
import helmet from "helmet";
import * as compression from "compression";
import { TimeoutInterceptor } from "@/_core/interceptors/timeout.interceptor";
import { GLOBAL_MESSAGES } from "@/_core/constants/common.constants";

async function bootstrap(): Promise<void> {
  //Logger
  const logger = new Logger();

  // Application
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: "An Management",
    }),
  });
  app.setGlobalPrefix("api/");

  // Interceptor
  app.useGlobalInterceptors(new TimeoutInterceptor(1000 * 3));

  //Validate
  // app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("An Management API DOCUMENT")
    .setDescription("The API description")
    .setVersion("2.0")
    .addBearerAuth({
      type: "http",
      name: "Authorization",
      in: "header",
    })
    .addGlobalParameters({
      name: "client_id",
      in: "header",
      // required: true,
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const whitelist = Array.from(
    (process.env.CORS_ORIGIN || "").split(",").map((el) => el.trim()),
  );
  app.enableCors({
    origin: (origin: any, callback: any) => {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        throw new ForbiddenException(GLOBAL_MESSAGES.ORIGIN_NOT_IN_WHITELIST);
      }
    },
    credentials: true,
    allowedHeaders:
      "Origin, X-CSRF-TOKEN, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, channel, request-id, Authorization, X-LANG",
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS,PATCH",
  });

  app.use(cookieParser());
  app.use(
    session({
      cookie: { maxAge: 7 * 60 * 60 * 1000 },
      secret:
        process.env.SESSION_SECRET ||
        "QhkVvpxK4RfRe6GP74x6pfL85gvUp5NznDMKz7CN2YGWAHI4",
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ limit: "10mb", extended: true }));
  app.use(helmet());
  app.use(compression());

  // Start Application
  await app.listen(process.env.PORT ?? 5621, () => {
    logger.log(
      `🚀 🔥 🔥 🔥 Application listen on port ${process.env.PORT} 🎧`,
      "SERVER",
    );
  });
}
bootstrap();
