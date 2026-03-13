import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { InquiryResponseDto } from '../inquiries/dto/inquiry-response.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly resendFromEmail: string;
  private readonly resendInquiryToEmail: string;
  private readonly resendSendStudentConfirmation: boolean;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>(
      'app.integrations.resendApiKey',
    );

    this.resend = apiKey ? new Resend(apiKey) : null;
    this.resendFromEmail =
      this.configService.get<string>('app.integrations.resendFromEmail') ?? '';
    this.resendInquiryToEmail =
      this.configService.get<string>('app.integrations.resendInquiryToEmail') ??
      '';
    this.resendSendStudentConfirmation =
      this.configService.get<boolean>(
        'app.integrations.resendSendStudentConfirmation',
      ) ?? false;
  }

  async sendInquiryNotifications(inquiry: InquiryResponseDto) {
    if (!this.isConfigured()) {
      this.logger.warn(
        'Skipping inquiry email notifications because Resend is not fully configured.',
      );
      return;
    }

    await this.sendInternalNotification(inquiry);

    if (this.resendSendStudentConfirmation) {
      await this.sendStudentConfirmation(inquiry);
    }
  }

  private isConfigured() {
    return Boolean(
      this.resend && this.resendFromEmail && this.resendInquiryToEmail,
    );
  }

  private async sendInternalNotification(inquiry: InquiryResponseDto) {
    await this.resend?.emails.send({
      from: this.resendFromEmail,
      to: [this.resendInquiryToEmail],
      replyTo: inquiry.email,
      subject: `New enquiry: ${inquiry.subject} (${inquiry.levelOfStudy})`,
      text: [
        'A new inquiry has been submitted.',
        '',
        `Name: ${inquiry.firstName} ${inquiry.lastName ?? ''}`.trim(),
        `Email: ${inquiry.email}`,
        `Phone: ${inquiry.phone ?? 'Not provided'}`,
        `Level of Study: ${inquiry.levelOfStudy}`,
        `Subject: ${inquiry.subject}`,
        `Status: ${inquiry.status}`,
        '',
        'Message:',
        inquiry.message ?? 'No message provided.',
      ].join('\n'),
    });
  }

  private async sendStudentConfirmation(inquiry: InquiryResponseDto) {
    await this.resend?.emails.send({
      from: this.resendFromEmail,
      to: [inquiry.email],
      subject: 'We received your Perfect Tutorials inquiry',
      text: [
        `Hi ${inquiry.firstName},`,
        '',
        'We received your inquiry and will get back to you soon.',
        '',
        `Subject: ${inquiry.subject}`,
        `Level of Study: ${inquiry.levelOfStudy}`,
        '',
        'Best regards,',
        'Perfect Tutorials',
      ].join('\n'),
    });
  }
}
