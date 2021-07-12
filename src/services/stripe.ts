
import Stripe from 'stripe';
import { version } from '../../package.json'

export const stripe = new Stripe(
  // Passa a chave secreta
  process.env.STRIPE_API_KEY,
  {
    // Versão do Stripe
    apiVersion: '2020-08-27',
    appInfo: {
      // Nome da API
      name: 'Ignews',
      // Versão do projeto
      version
    },
  }
)