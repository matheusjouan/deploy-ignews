import { render, screen } from '@testing-library/react';
import { getPrismicClient } from '../../services/prismic';

import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { mocked } from 'ts-jest/utils';
import { getSession } from 'next-auth/client';



const post =
{
  slug: 'fake-slug',
  title: 'fake-title',
  content: '<p>fake-content</p>',
  updatedAt: 'fake-updatedAt'
}

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe('Posts page', () => {

  it('renders correctly', () => {
    render(
      <Post
        post={post}
      />
    )

    expect(screen.getByText('fake-title')).toBeInTheDocument();
    expect(screen.getByText('fake-content')).toBeInTheDocument();


  });


  it('redirect user if no subscription', async () => {

    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const response = await getServerSideProps({ params: { slug: 'fake-slug' } } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/'
        })
      })
    )

  })


  it('loads initial data', async () => {

    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{
            type: 'heading', text: 'fake-title'
          }],
          content: [{
            type: 'paragraph', text: 'fake-content'
          }],
        },
        last_publication_date: '04-01-2021',
      })
    } as any)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active',
    } as any);

    const response = await getServerSideProps({ params: { slug: 'fake-slug' } } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-slug',
            title: 'fake-title',
            content: '<p>fake-content</p>',
            updatedAt: '2021 M04 01',
          }
        }
      })
    )

  })



});