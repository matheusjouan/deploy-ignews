import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";


async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === "string" ? Buffer.from(chunk) : chunk
    )
  }
  return Buffer.concat(chunks)
}

// Desabilita o formato da requisão em JSON, pois está vindo em uma stream
export const config = {
  api: {
    bodyParser: false
  }
}

// Quais eventos queremos ouvir do webhook do Stripe
const relevantEvent = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);

    // Onde esta armazenada o segredo da requisição do stripe
    const secret = req.headers['stripe-signature'];

    // Trecho de código de Verificação - Aconselhada pelo Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // Retorna o tipo do evento
    const type = event.type;

    // Ações para evento relevante para nossa aplicação
    if (relevantEvent.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed':

            // Eventos da parte de checkout do stripe
            const checkoutSession = event.data.object as Stripe.Checkout.Session

            // Função criada na pasta _lib
            await saveSubscription(
              checkoutSession.subscription.toString(),
              checkoutSession.customer.toString(),
              true
            );
            break;

          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':

            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription(
              subscription.id,
              subscription.customer.toString(),
              false,
            )
            break;

          default:
            throw new Error('Unhandled event');
        }
      } catch (err) {
        return res.json({ error: 'Webhook handler failed' });
      }
    }

    return res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Mathod not allowed');
  }
}