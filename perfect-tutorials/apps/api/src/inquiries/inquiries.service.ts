import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

type InquiryRecord = {
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

@Injectable()
export class InquiriesService {
  private readonly inquiries: InquiryRecord[] = [];

  create(createInquiryDto: CreateInquiryDto) {
    const inquiry: InquiryRecord = {
      id: randomUUID(),
      firstName: createInquiryDto.firstName.trim(),
      lastName: createInquiryDto.lastName?.trim() || null,
      email: createInquiryDto.email.trim().toLowerCase(),
      phone: createInquiryDto.phone?.trim() || null,
      level: createInquiryDto.level.trim(),
      subject: createInquiryDto.subject.trim(),
      message: createInquiryDto.message?.trim() || null,
      createdAt: new Date().toISOString(),
    };

    this.inquiries.push(inquiry);

    return {
      message: 'Inquiry submitted successfully',
      inquiry,
    };
  }
}
