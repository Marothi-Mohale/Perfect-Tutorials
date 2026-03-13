import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Inquiry, Prisma } from '@prisma/client';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApiSuccessResponse } from '../common/dto/api-success-response.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiriesListResponseDto } from './dto/inquiries-list-response.dto';
import { InquiryResponseDto } from './dto/inquiry-response.dto';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async findAll(): Promise<ApiSuccessResponse<InquiriesListResponseDto>> {
    try {
      const inquiries = await this.prisma.inquiry.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        message: 'Inquiries retrieved successfully',
        data: {
          inquiries: inquiries.map((inquiry) => this.toResponseDto(inquiry)),
        },
      };
    } catch (error) {
      throw this.handlePersistenceError(error);
    }
  }

  async create(
    createInquiryDto: CreateInquiryDto,
  ): Promise<ApiSuccessResponse<{ inquiry: InquiryResponseDto }>> {
    const normalizedInput = this.normalizeInput(createInquiryDto);

    try {
      const recentDuplicate = await this.prisma.inquiry.findFirst({
        where: {
          email: normalizedInput.email,
          firstName: normalizedInput.firstName,
          lastName: normalizedInput.lastName,
          phone: normalizedInput.phone,
          levelOfStudy: normalizedInput.levelOfStudy,
          subject: normalizedInput.subject,
          message: normalizedInput.message,
          createdAt: {
            gte: new Date(Date.now() - 10 * 60 * 1000),
          },
        },
      });

      if (recentDuplicate) {
        throw new ConflictException({
          code: 'DUPLICATE_INQUIRY',
          message:
            'A similar enquiry was already submitted recently. Please wait a few minutes before trying again.',
          errors: [
            {
              field: 'email',
              messages: ['A similar enquiry was already submitted recently.'],
            },
          ],
        });
      }

      const inquiry = await this.prisma.inquiry.create({
        data: normalizedInput,
      });
      const inquiryResponse = this.toResponseDto(inquiry);

      try {
        await this.emailService.sendInquiryNotifications(inquiryResponse);
      } catch (error) {
        this.logger.error(
          `Inquiry ${inquiry.id} persisted but email notifications failed.`,
          error instanceof Error ? error.stack : undefined,
        );
      }

      return {
        success: true,
        message: 'Inquiry submitted successfully',
        data: {
          inquiry: inquiryResponse,
        },
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      throw this.handlePersistenceError(error);
    }
  }

  private normalizeInput(createInquiryDto: CreateInquiryDto) {
    return {
      firstName: createInquiryDto.firstName.trim(),
      lastName: createInquiryDto.lastName?.trim() || null,
      email: createInquiryDto.email.trim().toLowerCase(),
      phone: createInquiryDto.phone?.trim() || null,
      levelOfStudy: createInquiryDto.levelOfStudy.trim(),
      subject: createInquiryDto.subject.trim(),
      message: createInquiryDto.message?.trim() || null,
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

  private handlePersistenceError(error: unknown): InternalServerErrorException {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new InternalServerErrorException({
        code: 'INQUIRY_PERSISTENCE_ERROR',
        message: 'We could not save your enquiry right now. Please try again.',
        errors: [],
      });
    }

    return new InternalServerErrorException({
      code: 'INQUIRY_SERVICE_ERROR',
      message: 'We could not process your enquiry right now. Please try again.',
      errors: [],
    });
  }
}
