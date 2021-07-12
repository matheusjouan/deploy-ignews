import { loadStripe } from '@stripe/stripe-js';

export async function getStripeJs() {
  // Passa a chave pública
  const stripeJS = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

  return stripeJS;
}