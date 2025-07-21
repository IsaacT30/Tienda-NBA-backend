import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as fs from 'fs'; // opcional, solo para log/diagnóstico

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  const publicPath = join(process.cwd(), 'public'); // <-- siempre apunta al root del proyecto
  console.log('[Static] Serving from:', publicPath, 'exists?', fs.existsSync(publicPath));

  app.useStaticAssets(publicPath, {
    prefix: '/static/',  // o '/imagenes/' si prefieres
  });

  app.enableCors();
  await app.listen(3050);
}
bootstrap();
