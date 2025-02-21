import usePreventDoubleNavigation from '@/customfook/usePreventDoubleNavigation';
import Link from 'next/link';
import React from 'react'

type Props = {
  tags: string[],
};

const Tag = (props: Props) => {
  const { tags } = props;
  const navigate = usePreventDoubleNavigation();

  return (
    <div className="mx-4">
      <section className="lg:w-1/2 mb-8 mx-auto bg-orange-200 rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 duration-300 transition-all">
        <div className="font-medium mb-4">タグ検索</div>
        <div className="flex flex-wrap gap-5">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="cursor-pointer px-2 font-medium pb-1 rounded-xl bg-gray-400 inline-block"
              onClick={() => navigate(`/posts/tag/${tag}/page/1`)}>
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tag;