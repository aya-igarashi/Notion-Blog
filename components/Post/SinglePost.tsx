import usePreventDoubleNavigation from '@/customfook/usePreventDoubleNavigation';
import Link from 'next/dist/client/link';
import React from 'react'

type Props = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  slug: string;
  isPaginationPage: boolean;
};

export const SinglePost = (props: Props) => {
  const { title, description, date, tags, slug, isPaginationPage } = props;
  const navigate = usePreventDoubleNavigation();


  return (
    <>
      {isPaginationPage ? (
        <section
          className="bg-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className='flex items-center'>
            <h2 className='text-gray-100 text-2xl font-medium mb-2 cursor-pointer'
              onClick={() => navigate(`/posts/${slug}`)}>
              {title}
            </h2>
            <div className='text-gray-100 mr-2'>{date}</div>
            {tags.map((tag: string, index: number) => (
              <span key={index}
                className='text-white bg-gray-500 rounded-xl px-2 pb-1 dont-medium mr-2 cursor-pointer'
                onClick={() => navigate(`/posts/tag/${tag}/page/1`)}>
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-100">{description}</p>
        </section>
      ) : (
        <section
          className="lg:w-1/2 bg-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
          <div className='flex items-center gap-3'>
            <h2 className='text-gray-100 text-2xl font-medium mb-2 cursor-pointer'
              onClick={() => navigate(`/posts/${slug}`)}>
              {title}
            </h2>
            <div className='text-gray-100'>{date}</div>
            {tags.map((tag: string, index: number) => (
              <span
                key={index}
                className='text-white bg-gray-500 rounded-xl px-2 pb-1 dont-medium cursor-pointer'
                onClick={() => navigate(`/posts/tag/${tag}/page/1`)}>
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-100">{description}</p>
        </section>
      )}
    </>
  )
}
