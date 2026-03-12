import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { InquiryStatus } from '@prisma/client';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

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
    levelOfStudy: string;
    subject: string;
    message: string | null;
    status: InquiryStatus;
    createdAt: string;
    updatedAt: string;
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
  let createdInquiryCount = 0;

  const prismaServiceMock = {
    inquiry: {
      findMany: jest.fn(() => {
        const now = new Date();

        if (!createdInquiryCount) {
          return Promise.resolve([]);
        }

        return Promise.resolve([
          {
            id: 'inquiry_1',
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
            phone: '+27123456789',
            levelOfStudy: 'University',
            subject: 'Mathematics',
            message: 'Looking for weekly calculus support.',
            status: InquiryStatus.NEW,
            createdAt: now,
            updatedAt: now,
          },
        ]);
      }),
      create: jest.fn(({ data }: { data: Record<string, string | null> }) => {
        createdInquiryCount += 1;
        const now = new Date();

        return Promise.resolve({
          id: `inquiry_${createdInquiryCount}`,
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? null,
          email: data.email ?? '',
          phone: data.phone ?? null,
          levelOfStudy: data.levelOfStudy ?? '',
          subject: data.subject ?? '',
          message: data.message ?? null,
          status: InquiryStatus.NEW,
          createdAt: now,
          updatedAt: now,
        });
      }),
    },
  };

  beforeEach(async () => {
    createdInquiryCount = 0;
    prismaServiceMock.inquiry.findMany.mockClear();
    prismaServiceMock.inquiry.create.mockClear();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

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
        levelOfStudy: 'University',
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
        levelOfStudy: 'University',
        subject: 'Mathematics',
        message: 'Looking for weekly calculus support.',
        status: InquiryStatus.NEW,
      },
    });
    expect(body.inquiry.id).toEqual(expect.any(String));
    expect(body.inquiry.createdAt).toEqual(expect.any(String));
    expect(body.inquiry.updatedAt).toEqual(expect.any(String));
  });

  it('rejects an invalid inquiry payload with field errors', async () => {
    const response = await request(httpServer)
      .post('/api/inquiries')
      .send({
        firstName: '',
        email: 'not-an-email',
        levelOfStudy: '',
        subject: '',
      })
      .expect(400);
    const body = response.body as ValidationFailureResponse;

    expect(body.message).toBe('Validation failed');
    expect(body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'firstName' }),
        expect.objectContaining({ field: 'email' }),
        expect.objectContaining({ field: 'levelOfStudy' }),
        expect.objectContaining({ field: 'subject' }),
      ]),
    );
  });

  it('lists saved inquiries', async () => {
    await request(httpServer)
      .post('/api/inquiries')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'ada@example.com',
        phone: '+27123456789',
        levelOfStudy: 'University',
        subject: 'Mathematics',
        message: 'Looking for weekly calculus support.',
      })
      .expect(201);

    const response = await request(httpServer)
      .get('/api/inquiries')
      .expect(200);
    const body = response.body as { inquiries: InquiryResponse['inquiry'][] };

    expect(body.inquiries).toHaveLength(1);
    expect(body.inquiries[0]).toMatchObject({
      firstName: 'Ada',
      levelOfStudy: 'University',
      status: InquiryStatus.NEW,
    });
  });
});
