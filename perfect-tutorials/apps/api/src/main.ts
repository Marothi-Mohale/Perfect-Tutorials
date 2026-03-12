import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number.parseInt(process.env.PORT ?? '3001', 10);
  const corsOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const allowedOrigins = corsOrigins?.length
    ? corsOrigins
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[]) =>
        new BadRequestException({
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
}
void bootstrap();
