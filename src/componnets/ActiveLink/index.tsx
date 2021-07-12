import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

// extends LinksProps => Estende as demais props do <Link>
interface ActiveLinksProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinksProps) {

  // asPath => retorna a rota da página no momento
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : '';

  return (
    <Link {...rest}>
      {/* Clonando elemento e passando uma propriedade, pq children nçao recebe props */}
      {cloneElement(children, {
        className
      })}
    </Link>
  )
}