import { render, screen } from '@testing-library/react';
import { getPrismicClient } from '../../services/prismic';

import Posts, { getStaticProps } from '../../pages/posts';
import { mocked } from 'ts-jest/utils';



const posts = [
  { slug: 'fake-slug', title: 'fake-title', excerpt: 'fake-excerpt', updatedAt: 'fake-updatedAt' }
]

jest.mock('../../services/prismic');

describe('Posts page', () => {

  it('renders correctly', () => {
    render(
      <Posts
        posts={posts}
      />
    )

    expect(screen.getByText('fake-title')).toBeInTheDocument();

  });


  it('loads initials data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-slug',
            data: {
              title: [{
                type: 'heading', text: 'fake-title'
              }],
              content: [{
                type: 'paragraph', text: 'fake-excerpt'
              }],
            },
            last_publication_date: '04-01-2021',
          }
        ]
      })
    } as any)


    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'fake-slug',
            title: 'fake-title',
            excerpt: 'fake-excerpt',
            updatedAt: '2021 M04 01',
          }]
        }
      })
    )
  })
});