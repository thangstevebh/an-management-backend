import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TimeoutInterceptor } from "./_core/interceptors/timeout.interceptor";
import { ForbiddenException, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { GLOBAL_MESSAGES } from "./_core/constants/common.constants";
import { json, urlencoded } from "express";
import helmet from "helmet";

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;

  const NODE_ENV = process.env.NODE_ENV ?? "development";

  if (NODE_ENV === "production") {
    console.log("Running in production mode");
  } else {
    console.log("Running in development mode");
  }

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/");

  // Interceptor
  app.useGlobalInterceptors(new TimeoutInterceptor(1000 * 3));

  //Validate
  // app.useGlobalPipes(new I18nValidationPipe());
  app.useGlobalPipes(new ValidationPipe());

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

  const whitelist = Array.from(
    (process.env.WHITE_LIST || "").split(",").map((el) => el.trim()),
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

  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
