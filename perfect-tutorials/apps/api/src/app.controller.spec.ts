import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailService } from './email/email.service';
import { InquiriesModule } from './inquiries/inquiries.module';
import { PrismaService } from './prisma/prisma.service';

describe('AppController', () => {
  let appController: AppController;

  const prismaServiceMock = {
    inquiry: {
      findMany: jest.fn(() => Promise.resolve([])),
      findFirst: jest.fn(() => Promise.resolve(null)),
      create: jest.fn(),
    },
  };

  const emailServiceMock = {
    sendInquiryNotifications: jest.fn(() => Promise.resolve()),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [InquiriesModule],
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .overrideProvider(EmailService)
      .useValue(emailServiceMock)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return a healthy status payload', () => {
      expect(appController.getHealth()).toMatchObject({
        status: 'ok',
        service: 'perfect-tutorials-api',
      });
    });
  });
});
