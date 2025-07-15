import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const PORT = process.env.PORT ?? 3000;

  const NODE_ENV = process.env.NODE_ENV ?? "development";

  if (NODE_ENV === "production") {
    console.log("Running in production mode");
  } else {
    console.log("Running in development mode");
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}
bootstrap();
