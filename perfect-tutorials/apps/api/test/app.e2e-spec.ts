import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

type InquiryResponse = {
  message: string;
  inquiry: {
    id: string;
    firstName: string;
    lastName: string | null;
    email: string;
    phone: string | null;
    level: string;
    subject: string;
    message: string | null;
    createdAt: string;
  };
};

type ValidationFailureResponse = {
  message: string;
  errors: Array<{
    field: string;
    messages: string[];
  }>;
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Parameters<typeof request>[0];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    await app.close();
  });

  it('bootstraps the application and exposes the health payload', async () => {
    const response = await request(httpServer).get('/api/health').expect(200);
    const body = response.body as HealthResponse;

    expect(body).toMatchObject({
      status: 'ok',
      service: 'perfect-tutorials-api',
    });
    expect(body.timestamp).toEqual(expect.any(String));
  });

  it('creates an inquiry with a valid payload', async () => {
    const response = await request(httpServer)
      .post('/api/inquiries')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '+27123456789',
        level: 'University',
        subject: 'Mathematics',
        message: 'Looking for weekly calculus support.',
      })
      .expect(201);
    const body = response.body as InquiryResponse;

    expect(body).toMatchObject({
      message: 'Inquiry submitted successfully',
      inquiry: {
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '+27123456789',
        level: 'University',
        subject: 'Mathematics',
        message: 'Looking for weekly calculus support.',
      },
    });
    expect(body.inquiry.id).toEqual(expect.any(String));
    expect(body.inquiry.createdAt).toEqual(expect.any(String));
  });

  it('rejects an invalid inquiry payload with field errors', async () => {
    const response = await request(httpServer)
      .post('/api/inquiries')
      .send({
        firstName: '',
        email: 'not-an-email',
        level: '',
        subject: '',
      })
      .expect(400);
    const body = response.body as ValidationFailureResponse;

    expect(body.message).toBe('Validation failed');
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'firstName' }),
        expect.objectContaining({ field: 'email' }),
        expect.objectContaining({ field: 'level' }),
        expect.objectContaining({ field: 'subject' }),
      ]),
    );
  });
});
