
import { SubscribeButton } from '.';
// Importa a funcionalidade a ser Mockada
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils'
import { render, screen, fireEvent } from '@testing-library/react';


jest.mock('next-auth/client')
jest.mock('next/router');

describe('SignInButton Component', () => {

  const useSessionMocked = mocked(useSession);
  useSessionMocked.mockReturnValueOnce([null, false]);

  it('renders correctly', () => {
    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  });

  it('redirects user to sign in when not autenticated', () => {

    const signInMocked = mocked(signIn);

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(
      <SubscribeButton />
    )
    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });

  it('redirects user to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    // jest.fn() => função que não tem nenhum retorno, para verificar se foi chamada
    const pushMocked = jest.fn();

    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        expires: 'fake',
        activeSubscription: 'fake-active-subscription'
      },
      false
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any)

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(pushMocked).toHaveBeenCalled();
  });

})

