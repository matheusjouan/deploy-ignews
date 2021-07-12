// Basicamente renderiza o componente de "maneira virtual"
// para conseguir ver o output to componente

import { render } from '@testing-library/react';
import { ActiveLink } from '.';


jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink component', () => {

  test('renders correctly', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active" >
        <a>Home</a>
      </ActiveLink>
    )

    // Verifica se existe o elemento com texto "Home" dentro do documento
    expect(getByText('Home')).toBeInTheDocument();

  });

  it('adds active class if the link as currently active', () => {
    const { getByText } = render(
      <ActiveLink href="/" activeClassName="active" >
        <a>Home</a>
      </ActiveLink>
    )

    // Verifica se o componente com texto "Home" está recebendo 
    // a classe "active" que é a lógica criado dentro do componente
    expect(getByText('Home')).toHaveClass('active');
  });
})


