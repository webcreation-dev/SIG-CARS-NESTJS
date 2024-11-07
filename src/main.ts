import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Express } from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  (app as unknown as Express).set('etag', false);

  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });

  await app.listen(3000);
}

bootstrap();
