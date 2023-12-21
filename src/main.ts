import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
  const PORT = process.env.PORT || 5000;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Online shop api')
    .setDescription('Online shop api methods')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true
    })
  );

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
start();
