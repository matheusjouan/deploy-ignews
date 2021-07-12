import Prismic from '@prismicio/client';

/**
 * O prismic recomenda quando estamos fazendo uma chamada Server-Side
 * que passamos o "requisição" como parâmetro e repassamo no objeto
 */
export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(
    // ENDPOINT fornecido pelo PRISMIC
    process.env.PRISMIC_ENDPOINT,
    {
      req,
      // Chave de acesso p/ conteúdo privados
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    }
  )

  return prismic;
}
