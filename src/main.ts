import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as webPush from 'web-push';
import { config } from './config';
const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
    const options = new DocumentBuilder()
    .setTitle('Music Land API')
    .setDescription('This is the official API of Music Land System')
    .setVersion('1.0')
    .addTag('songs, music, albums, artists, musicians, singers, notifications, chats, gateways, rooms, auth, strategies, jwt')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    config.vapidKeys.publicKey,
    config.vapidKeys.privateKey,
  );
  const port: number = parseInt(`${process.env.PORT}`) || 3000;

  await app.listen(port);
};
bootstrap();
