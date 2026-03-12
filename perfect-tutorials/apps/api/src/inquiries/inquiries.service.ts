import { Injectable } from '@nestjs/common';
import { Inquiry } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiryResponseDto } from './dto/inquiry-response.dto';

@Injectable()
export class InquiriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<{ inquiries: InquiryResponseDto[] }> {
    const inquiries = await this.prisma.inquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      inquiries: inquiries.map((inquiry) => this.toResponseDto(inquiry)),
    };
  }

  async create(
    createInquiryDto: CreateInquiryDto,
  ): Promise<{ message: string; inquiry: InquiryResponseDto }> {
    const inquiry = await this.prisma.inquiry.create({
      data: {
        firstName: createInquiryDto.firstName.trim(),
        lastName: createInquiryDto.lastName?.trim() || null,
        email: createInquiryDto.email.trim().toLowerCase(),
        phone: createInquiryDto.phone?.trim() || null,
        levelOfStudy: createInquiryDto.levelOfStudy.trim(),
        subject: createInquiryDto.subject.trim(),
        message: createInquiryDto.message?.trim() || null,
      },
    });

    return {
      message: 'Inquiry submitted successfully',
      inquiry: this.toResponseDto(inquiry),
    };
  }

  private toResponseDto(inquiry: Inquiry): InquiryResponseDto {
    return {
      id: inquiry.id,
      firstName: inquiry.firstName,
      lastName: inquiry.lastName,
      email: inquiry.email,
      phone: inquiry.phone,
      levelOfStudy: inquiry.levelOfStudy,
      subject: inquiry.subject,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt.toISOString(),
      updatedAt: inquiry.updatedAt.toISOString(),
    };
  }
}
