import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';
import { validationPipeOptions } from './common/validation/validation-pipe-options';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('app.port');
  const allowedOrigins = configService.getOrThrow<string[]>('app.corsOrigins');

  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new ApiExceptionFilter());

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.enableShutdownHooks();
  const httpServer = app.getHttpAdapter().getInstance() as {
    disable: (header: string) => void;
  };

  httpServer.disable('x-powered-by');

  await app.listen(port, '0.0.0.0');
  logger.log(`API listening on port ${port}`);
}
void bootstrap();
