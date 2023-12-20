import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from "process";
import {ValidationPipe} from "@nestjs/common";

async function start() {
  const PORT = process.env.PORT || 5000

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
start();
