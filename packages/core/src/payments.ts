import type { Order } from './services';

export interface CheckoutSession { url: string; reference: string }

export interface PaymentProvider {
  name: string;
  createCheckout(order: Order, returnUrl: string): Promise<CheckoutSession>;
}

/** Placeholder until a provider is agreed. Swap this for Stripe Connect or similar. */
export const noPayments: PaymentProvider = {
  name: 'none',
  async createCheckout() {
    throw new Error('Online payments are not enabled yet.');
  },
};
