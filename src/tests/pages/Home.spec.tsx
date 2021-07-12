import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';

import Home, { getStaticProps } from '../../pages';
import { mocked } from 'ts-jest/utils';


jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
});

jest.mock('../../services/stripe');

describe('Home page', () => {

  it('renders correctly', () => {
    render(
      <Home
        product={{ priceId: 'fake-price-id', amount: 'fake-amount' }}
      />
    )

    expect(screen.getByText(/fake-amount/i)).toBeInTheDocument();

  });


  // Terá método assincrono, por isso async
  it('loads initials data', async () => {
    // Mockar o stripe que faz a requisição p/ API de pagamentos
    const retrivestripePricesMocked = mocked(stripe.prices.retrieve);

    // Função assíncrona utiliza mockResolvedValueOnce()
    retrivestripePricesMocked.mockResolvedValueOnce({
      id: 'fake-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
});