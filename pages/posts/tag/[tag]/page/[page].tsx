import Pagenation from '@/components/Pagenation/Pagenation';
import { SinglePost } from '@/components/Post/SinglePost';
import Tag from '@/components/Tag/Tag';
import { getAllTags, getNumberOfPages, getNumberOfPagesByTag, getPostsByPage, getPostsByTagAndPage } from '@/lib/notionAPI';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

export const getStaticPaths: GetStaticPaths = async () => {

  // 全てのタグを取得
  const allTags = await getAllTags();
  console.log(allTags);

  let paths: { params: { tag: string; page: string; } }[] = [];

  // 各タグごとにページ数を取得し、パスを構築
  await Promise.all(allTags.map(async (tag) => {
    const numberOfPagesByTag = await getNumberOfPagesByTag(tag);
    for (let i = 1; i <= numberOfPagesByTag; i++) {
      paths.push({ params: { tag: tag, page: i.toString() } });
    }
  }));
  console.log(paths);

  return {
    paths,
    fallback: false,
  }
}

// getStaticProps関数： これはNext.jsのデータ取得メソッドの一つで、ビルド時（静的サイト生成時）に実行されます。
// この関数は、特定のページコンポーネントに必要なデータを取得するために使用されます。
export const getStaticProps: GetStaticProps = async (context) => {
  // currentPageが存在しない場合は処理を終了
  if (!context.params?.page || !context.params.tag) {
    return { props: {} };
  }
  const currentPage: string = context.params?.page.toString();
  const currentTag: string = context.params?.tag.toString();

  // 頭文字に大文字を適用
  const upperCaseCurrentTag = currentTag.charAt(0).toUpperCase() + currentTag.slice(1);

  const posts = await getPostsByTagAndPage(upperCaseCurrentTag, parseInt(currentPage, 10));

  const numberOfPagesByTag = await getNumberOfPagesByTag(upperCaseCurrentTag);

  const allTags = await getAllTags();

  return {
    props: {
      posts,
      numberOfPagesByTag,
      upperCaseCurrentTag,
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

  posts: BlogPost[];
  numberOfPagesByTag: number;
  upperCaseCurrentTag: string;
  allTags: string[];
};

const BlogTagPageList = ({ numberOfPagesByTag, posts, upperCaseCurrentTag, allTags }: BlogPageListProps) => {

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
            {posts.map((post: BlogPost) => (
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
          <Pagenation numberOfPage={numberOfPagesByTag} tag={upperCaseCurrentTag} />
          <Tag tags={allTags} />
        </main>
      </div>
    </>
  )
}

export default BlogTagPageList;