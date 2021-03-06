
import { Header } from '.';
import { render, screen } from '@testing-library/react';


jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
});

jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    }
  }
})

describe('Header component', () => {

  test('renders correctly', () => {
    render(
      <Header />
    )

    // screen => Componente esta sendo renderizado em tela
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Post')).toBeInTheDocument();

  });
})

