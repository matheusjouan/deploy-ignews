
import { SignInButton } from '.';
// Importa a funcionalidade a ser Mockada
import { useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils'
import { render, screen } from '@testing-library/react';


// Mock da lib que utiliza a funcionalidade useSession
jest.mock('next-auth/client')

describe('SignInButton Component', () => {

  it('renders correctly when user is not authenticated', () => {
    // Cria uma variável p/ utilizar propriedades de Mocked da funcionalidade
    const useSessionMocked = mocked(useSession);

    // Define o valor do retorno do mock
    // - mockReturnValue: o retorno será sempre o mesmo, após definido esse valor
    // para todos os testes abaixo desse mock

    // - mockReturnValueOnce: só será retornado esse valor uma única vez (prox retorno),
    // ou seja, para o teste que está sendo utilizado

    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <SignInButton />
    )

    // Espero que seja encontrado um botão chamado 'Sign in...'
    expect(screen.getByText('Sign in with GitHub')).toBeInTheDocument();

  });

  it('renders correctly when user is authenticated', () => {

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([
      { user: { name: 'John Doe', email: 'john.doe@example.com' }, expires: 'fake' },
      false
    ])

    render(
      <SignInButton />
    )

    // Espero que seja encontrado o nome do usuário'
    expect(screen.getByText('John Doe')).toBeInTheDocument();

  });
})

