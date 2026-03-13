import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/dto/api-success-response.dto';
import { CheckoutSessionResponseDto } from './dto/checkout-session-response.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout-sessions')
  @HttpCode(HttpStatus.CREATED)
  createCheckoutSession(
    @Body() createCheckoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<ApiSuccessResponse<CheckoutSessionResponseDto>> {
    return this.paymentsService.createCheckoutSession(createCheckoutSessionDto);
  }
}
