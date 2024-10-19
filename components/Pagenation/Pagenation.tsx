import usePreventDoubleNavigation from '@/customfook/usePreventDoubleNavigation';
import { getPageLink } from '@/lib/blog-helper';
import React from 'react'

interface Props {
  numberOfPage: number;
  tag: string;
}

const Pagenation = (props: Props) => {
  const { numberOfPage, tag } = props;
  const navigate = usePreventDoubleNavigation();

  let pages: number[] = [];
  for (let i = 1; i <= numberOfPage; i++) {
    pages.push(i);
  }

  return (
    <section className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
      <ul className="flex item-center justify-center gap-4">
        {pages.map((page) =>
          <li key={page} className="bg-sky-900 rounded-lg w-6 h-8 relative cursor-pointer"
            onClick={() => navigate(getPageLink(tag, page))}>
            <span className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-gray-100">{page}</span>
          </li>
        )}
      </ul>
    </section>
  )
}

export default Pagenation;

// rafce