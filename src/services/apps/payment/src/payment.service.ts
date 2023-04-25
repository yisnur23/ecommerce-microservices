import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectStripe } from 'nestjs-stripe';
import { PaymentRepository } from './payment.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    @InjectStripe() private stripe: Stripe,
    private paymentRepository: PaymentRepository,
    private configService: ConfigService,
  ) {}

  async createPayment(userId: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'ecom produ',
              description: 'item.desc',
              metadata: {
                id: 'item.id',
              },
            },
            unit_amount: 20 * 100,
          },
          quantity: 2,
        },
      ],
      success_url: 'http://localhost:8002/',
    });

    console.log(session);

    const payment = await this.paymentRepository.save({
      user_id: userId,
      stripe_session_id: session.id,
    });

    return session.url;
  }

  handleStripeEvents(eventBody, stripeSigniture: string) {
    const webHookSecret = this.configService.get('stripeWebHookSecret');
    let data;
    let eventType;

    if (webHookSecret) {
      let event;
      try {
        event = this.stripe.webhooks.constructEvent(
          eventBody,
          stripeSigniture,
          webHookSecret,
        );
      } catch (err) {
        throw new BadRequestException('web hook verfication failed');
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      data = eventBody.data.object;
      eventType = eventBody.type;
    }
    console.log('testingkk');
    // Handle the checkout.session.completed event
    if (eventType === 'checkout.session.completed') {
      console.log(data);
      console.log('session completed event');
    } else if (eventType === 'payment_intent.succeeded') {
      console.log('payment_intent succeeded event');
    }
    return 'success';
  }
}
