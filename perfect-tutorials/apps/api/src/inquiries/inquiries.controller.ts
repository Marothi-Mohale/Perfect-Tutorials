import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiSuccessResponse } from '../common/dto/api-success-response.dto';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { InquiriesListResponseDto } from './dto/inquiries-list-response.dto';
import { InquiryResponseDto } from './dto/inquiry-response.dto';
import { InquiriesService } from './inquiries.service';

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Get()
  findAll(): Promise<ApiSuccessResponse<InquiriesListResponseDto>> {
    return this.inquiriesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createInquiryDto: CreateInquiryDto,
  ): Promise<ApiSuccessResponse<{ inquiry: InquiryResponseDto }>> {
    return this.inquiriesService.create(createInquiryDto);
  }
}
