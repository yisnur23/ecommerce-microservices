import { User } from '@app/decorators/user.decorator';
import { AuthenticatedUser } from '@app/types/user.type';
import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  createPayment(@User() user: AuthenticatedUser) {
    console.log('user', user);
    return this.paymentService.createPayment(user.id);
  }

  @Get('webhook')
  getl() {
    return 'tessting';
  }

  @Post('webhook')
  handleStripeEvents(
    @Body() eventBody,
    @Headers('stripe-signiture') stripeSigniture,
  ) {
    return this.paymentService.handleStripeEvents(eventBody, stripeSigniture);
  }
}
