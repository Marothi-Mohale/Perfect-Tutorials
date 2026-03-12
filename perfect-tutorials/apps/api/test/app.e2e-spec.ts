import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { InquiryStatus } from '@prisma/client';
import { AppModule } from './../src/app.module';
import { ApiExceptionFilter } from './../src/common/filters/api-exception.filter';
import { validationPipeOptions } from './../src/common/validation/validation-pipe-options';
import { EmailService } from './../src/email/email.service';
import { PaymentsService } from './../src/payments/payments.service';
import { PrismaService } from './../src/prisma/prisma.service';

process.env.DATABASE_URL =
  'postgresql://postgres:postgres@localhost:5432/perfect_tutorials?schema=public';

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

type InquiryResponse = {
  success: true;
  message: string;
  data: {
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
};

type ValidationFailureResponse = {
  success: false;
  code: string;
  message: string;
  errors: Array<{
    field?: string;
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
      findFirst: jest.fn(() => Promise.resolve(null)),
    },
  };

  const emailServiceMock = {
    sendInquiryNotifications: jest.fn(() => Promise.resolve()),
  };

  const paymentsServiceMock = {
    createCheckoutSession: jest.fn(() =>
      Promise.resolve({
        success: true,
        message: 'Checkout session created successfully',
        data: {
          packageId: 'standard-4-sessions',
          checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_123',
        },
      }),
    ),
  };

  beforeEach(async () => {
    createdInquiryCount = 0;
    prismaServiceMock.inquiry.findMany.mockClear();
    prismaServiceMock.inquiry.create.mockClear();
    prismaServiceMock.inquiry.findFirst.mockClear();
    prismaServiceMock.inquiry.findFirst.mockResolvedValue(null);
    emailServiceMock.sendInquiryNotifications.mockClear();
    paymentsServiceMock.createCheckoutSession.mockClear();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .overrideProvider(EmailService)
      .useValue(emailServiceMock)
      .overrideProvider(PaymentsService)
      .useValue(paymentsServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();
    httpServer = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
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
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
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
      },
    });
    expect(body.data.inquiry.id).toEqual(expect.any(String));
    expect(body.data.inquiry.createdAt).toEqual(expect.any(String));
    expect(body.data.inquiry.updatedAt).toEqual(expect.any(String));
    expect(emailServiceMock.sendInquiryNotifications).toHaveBeenCalledTimes(1);
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

    expect(body.success).toBe(false);
    expect(body.code).toBe('VALIDATION_ERROR');
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
    const body = response.body as {
      success: true;
      message: string;
      data: { inquiries: InquiryResponse['data']['inquiry'][] };
    };

    expect(body.success).toBe(true);
    expect(body.data.inquiries).toHaveLength(1);
    expect(body.data.inquiries[0]).toMatchObject({
      firstName: 'Ada',
      levelOfStudy: 'University',
      status: InquiryStatus.NEW,
    });
  });

  it('rejects duplicate accidental submissions', async () => {
    prismaServiceMock.inquiry.findFirst.mockResolvedValue({
      id: 'duplicate_inquiry',
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
      phone: '+27123456789',
      levelOfStudy: 'University',
      subject: 'Mathematics',
      message: 'Looking for weekly calculus support.',
      status: InquiryStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);

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
      .expect(409);
    const body = response.body as ValidationFailureResponse;

    expect(body.code).toBe('DUPLICATE_INQUIRY');
    expect(body.message).toContain('already submitted recently');
  });

  it('returns a stable server error response when persistence fails', async () => {
    prismaServiceMock.inquiry.create.mockRejectedValueOnce(
      new Error('database unavailable'),
    );

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
      .expect(500);
    const body = response.body as ValidationFailureResponse;

    expect(body.success).toBe(false);
    expect(body.code).toBe('INQUIRY_SERVICE_ERROR');
    expect(body.message).toBe(
      'We could not process your enquiry right now. Please try again.',
    );
  });

  it('does not fail the inquiry when email delivery fails', async () => {
    emailServiceMock.sendInquiryNotifications.mockRejectedValueOnce(
      new Error('resend unavailable'),
    );

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

    expect(body.success).toBe(true);
    expect(body.message).toBe('Inquiry submitted successfully');
  });

  it('creates a Stripe checkout session for the supported package', async () => {
    const response = await request(httpServer)
      .post('/api/payments/checkout-sessions')
      .send({
        packageId: 'standard-4-sessions',
        clerkUserId: 'user_123',
        customerEmail: 'ada@example.com',
      })
      .expect(201);

    expect(response.body).toMatchObject({
      success: true,
      message: 'Checkout session created successfully',
      data: {
        packageId: 'standard-4-sessions',
        checkoutUrl: 'https://checkout.stripe.com/pay/cs_test_123',
      },
    });
    expect(paymentsServiceMock.createCheckoutSession).toHaveBeenCalledWith({
      packageId: 'standard-4-sessions',
      clerkUserId: 'user_123',
      customerEmail: 'ada@example.com',
    });
  });
});
