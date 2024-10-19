import { SinglePost } from '@/components/Post/SinglePost';
import Tag from '@/components/Tag/Tag';
import usePreventDoubleNavigation from '@/customfook/usePreventDoubleNavigation';
import { getAllTags, getPostsForTopPage } from '@/lib/notionAPI';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';


// getStaticProps関数： これはNext.jsのデータ取得メソッドの一つで、ビルド時（静的サイト生成時）に実行されます。
// この関数は、特定のページコンポーネントに必要なデータを取得するために使用されます。
export const getStaticProps: GetStaticProps = async () => {
  const fourPosts = await getPostsForTopPage(4);
  const allTags = await getAllTags();

  // return { props: { allPosts } };： ここで、getStaticProps関数はpropsオブジェクトを返しています。
  // このオブジェクトは、getStaticPropsによってデータが取得された後、対応するページコンポーネントに渡されます。
  // SSG(ビルドしたときに全てのデータを取ってくる)
  // リクエストを受けた際に再度呼び出す必要がなくなる
  return {
    props: {
      fourPosts,
      allTags,
    },
    // ISR(60秒ごとに再更新する)
    // ブログの更新頻度を考えて再更新頻度を実装していく
    revalidate: 60,
  };
};

type Blog = {
  id: number;
  title: string;
  description: string;
  date: string; // 日付の形式に応じて、stringやDate型を使う
  tags: string[];
  slug: string;
};

type Props = {
  fourPosts: Blog[];
  allTags: string[];
};


export default function Home({ fourPosts, allTags }: Props) {
  const navigate = usePreventDoubleNavigation();

  return (
    <div className="container h-full w-full mx-auto">
      <Head>
        <title>Notion-Blog</title>
      </Head>
      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">
          Notion Blog🚀
        </h1>
        {fourPosts.map((post: Blog) => (
          <div key={post.id} className="mx-4">
            <SinglePost
              title={post.title}
              description={post.description}
              date={post.date}
              tags={post.tags}
              slug={post.slug}
              isPaginationPage={false}
            />
          </div>
        ))}
        <button
          onClick={() => navigate('/posts/page/1')}
          className="mb-6 lg:w-1/2 px-5 block text-right">
          ...もっと見る
        </button>
        <Tag tags={allTags} />
      </main>
    </div>
  )
}
