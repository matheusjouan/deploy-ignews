import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import Link from 'next/link';

import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostsProps {
  posts: Post[]
}

export default function Post({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Post | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // utilizando API do prismic
  const prismic = getPrismicClient();

  // Buscar dados do Prismic
  // O mesmo possui uma lingugagem própria p/ querys (ver docs)
  // Nesse caso Query Singles Type document
  const response = await prismic.query([
    Prismic.predicates.at(
      'document.type', 'post'
    )], {
    // Quais dados quero buscar
    fetch: ['post.title', 'post.content'],
    // Quantos conteudos quero trazer por página
    pageSize: 100,
  });

  // results => resultados do CMS dos  conteúdos
  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      // RichText => Conversor do Prismic
      title: RichText.asText(post.data.title),
      // Resumo
      excerpt: post.data.content.find(
        content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date)
        .toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
    };
  });


  return {
    // Conteudo retornado p/ página por "props"
    props: {
      posts
    }
  }
}