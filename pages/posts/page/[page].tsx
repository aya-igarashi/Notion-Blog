import Pagenation from '@/components/Pagenation/Pagenation';
import { SinglePost } from '@/components/Post/SinglePost';
import Tag from '@/components/Tag/Tag';
import { getAllTags, getNumberOfPages, getPostsByPage } from '@/lib/notionAPI';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

export const getStaticPaths: GetStaticPaths = async () => {
  const numberOfPage = await getNumberOfPages();

  let paths = [];
  for (let i = 1; i <= numberOfPage; i++) {
    paths.push({ params: { page: i.toString() } });
  }

  return {
    paths,
    fallback: false,
  }
}

// getStaticProps関数： これはNext.jsのデータ取得メソッドの一つで、ビルド時（静的サイト生成時）に実行されます。
// この関数は、特定のページコンポーネントに必要なデータを取得するために使用されます。
export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage = context.params?.page;

  // currentPageが存在しない場合は処理を終了
  if (!currentPage) {
    return { props: {} };
  }
  // ページに応じた投稿を取得
  const postsByPage = await getPostsByPage(
    parseInt(currentPage.toString(), 10),
  )
  const numberOfPage = await getNumberOfPages();
  const allTags = await getAllTags();

  // return { props: { allPosts } };： ここで、getStaticProps関数はpropsオブジェクトを返しています。
  // このオブジェクトは、getStaticPropsによってデータが取得された後、対応するページコンポーネントに渡されます。
  // SSG(ビルドしたときに全てのデータを取ってくる)
  // リクエストを受けた際に再度呼び出す必要がなくなる
  return {
    props: {
      postsByPage,
      numberOfPage,
      allTags,
    },
    // ISR(60秒ごとに再更新する)
    // ブログの更新頻度を考えて再更新頻度を実装していく
    revalidate: 60,
  };
};

type BlogPost = {
  id: number;
  title: string;
  description: string;
  date: string; // 日付の形式に応じて、stringやDate型を使う
  tags: string[];
  slug: string;
};

type BlogPageListProps = {
  postsByPage: BlogPost[];
  numberOfPage: number;
  allTags: string[];
};

const BlogPageList = ({ postsByPage, numberOfPage, allTags }: BlogPageListProps) => {
  console.log(postsByPage);

  return (
    <>
      <div className="container h-full w-full mx-auto">
        <Head>
          <title>Notion-Blog</title>
        </Head>
        <main className="container w-full mt-16">
          <h1 className="text-5xl font-medium text-center mb-16">
            Notion Blog🚀
          </h1>
          <section className="sm:grid grid-cols-2 w-5/6 gap-3 mx-auto">
            {postsByPage.map((post: BlogPost) => (
              <div key={post.id}>
                <SinglePost
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  tags={post.tags}
                  slug={post.slug}
                  isPaginationPage={true}
                />
              </div>
            ))}
          </section>
          <Pagenation numberOfPage={numberOfPage} tag={""} />
          <Tag tags={allTags} />
        </main>
      </div>
    </>
  )
}

export default BlogPageList;