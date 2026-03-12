import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.getOrThrow<number>('app.port');
  const allowedOrigins = configService.getOrThrow<string[]>('app.corsOrigins');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[]) =>
        new BadRequestException({
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          errors: validationErrors.flatMap((validationError) => {
            const constraints = Object.values(
              validationError.constraints ?? {},
            );

            if (!constraints.length) {
              return [];
            }

            return [
              {
                field: validationError.property,
                messages: constraints,
              },
            ];
          }),
        }),
    }),
  );
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
