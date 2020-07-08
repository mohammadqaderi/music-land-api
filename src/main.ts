import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as webPush from 'web-push';
import { config } from './config';
const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    config.vapidKeys.publicKey,
    config.vapidKeys.privateKey,
  );
  const port: number = parseInt(`${process.env.PORT}`) || 3000;

  await app.listen(port);
};
bootstrap();
