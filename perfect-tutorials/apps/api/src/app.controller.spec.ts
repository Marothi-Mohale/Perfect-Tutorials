import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InquiriesModule } from './inquiries/inquiries.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [InquiriesModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

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
