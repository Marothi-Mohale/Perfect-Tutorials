import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './config/app.config';
import { validateEnv } from './config/env.validation';
import { EmailModule } from './email/email.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig],
      validate: validateEnv,
    }),
    EmailModule,
    PrismaModule,
    InquiriesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
