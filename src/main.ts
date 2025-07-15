import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ForbiddenException, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { TimeoutInterceptor } from "./_core/interceptors/timeout.interceptor";
import { GLOBAL_MESSAGES } from "./_core/constants/common.constants";
import { json, urlencoded } from "express";
import helmet from "helmet";
import * as compression from "compression";

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  console.log(`Environment: ${process.env.NODE_ENV}`);

  app.setGlobalPrefix("api/");

  // Interceptor
  app.useGlobalInterceptors(new TimeoutInterceptor(1000 * 3));

  //Validate
  // app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === "development") {
    // Swagger
    const config = new DocumentBuilder()
      .setTitle("Nestjs Base API DOCUMENT")
      .setDescription("The Nestjs Base API description")
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
  }

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

  app.use(json({ limit: "10mb" }));
  app.use(urlencoded({ limit: "10mb", extended: true }));
  app.use(helmet());
  app.use(compression());

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
