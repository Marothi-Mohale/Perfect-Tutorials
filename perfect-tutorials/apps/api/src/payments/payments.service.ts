import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ApiSuccessResponse } from '../common/dto/api-success-response.dto';
import { tutoringPackages } from './constants/tutoring-packages';
import { CheckoutSessionResponseDto } from './dto/checkout-session-response.dto';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly stripe: Stripe | null;

  constructor(private readonly configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>(
      'app.integrations.stripeSecretKey',
    );

    this.stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;
  }

  async createCheckoutSession(
    createCheckoutSessionDto: CreateCheckoutSessionDto,
  ): Promise<ApiSuccessResponse<CheckoutSessionResponseDto>> {
    const selectedPackage =
      tutoringPackages[createCheckoutSessionDto.packageId];

    if (!selectedPackage) {
      throw new BadRequestException({
        code: 'INVALID_PACKAGE',
        message: 'The selected package is not available for checkout.',
        errors: [
          {
            field: 'packageId',
            messages: ['The selected package is not available for checkout.'],
          },
        ],
      });
    }

    if (!this.stripe) {
      throw new ServiceUnavailableException({
        code: 'STRIPE_NOT_CONFIGURED',
        message:
          'Payments are not configured right now. Please try again later.',
        errors: [],
      });
    }

    const frontendUrl =
      this.configService.getOrThrow<string>('app.frontendUrl');

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: selectedPackage.currency,
              unit_amount: selectedPackage.amountInCents,
              product_data: {
                name: selectedPackage.name,
                description: selectedPackage.description,
              },
            },
          },
        ],
        client_reference_id: createCheckoutSessionDto.clerkUserId,
        customer_email: createCheckoutSessionDto.customerEmail,
        success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${frontendUrl}/checkout/cancel`,
        metadata: this.buildMetadata(
          createCheckoutSessionDto.packageId,
          createCheckoutSessionDto.clerkUserId,
        ),
      });

      if (!session.url) {
        throw new ServiceUnavailableException({
          code: 'STRIPE_SESSION_ERROR',
          message: 'We could not start checkout right now. Please try again.',
          errors: [],
        });
      }

      return {
        success: true,
        message: 'Checkout session created successfully',
        data: {
          packageId: selectedPackage.id,
          checkoutUrl: session.url,
        },
      };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      this.logger.error(
        `Failed to create Stripe checkout session for package ${selectedPackage.id}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new ServiceUnavailableException({
        code: 'STRIPE_SESSION_ERROR',
        message: 'We could not start checkout right now. Please try again.',
        errors: [],
      });
    }
  }

  private buildMetadata(packageId: string, clerkUserId?: string) {
    return {
      packageId,
      ...(clerkUserId ? { clerkUserId } : {}),
    };
  }
}
