import usePreventDoubleNavigation from '@/customfook/usePreventDoubleNavigation';
import { getAllPosts, getSinglePost } from '@/lib/notionAPI';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';


// 静的生成（Static Generation）を使用する際に、どのパス（URL）に対してページを生成するかを指定するために使われる
export const getStaticPaths = async () => {
  const allPosts = await getAllPosts();
  if (!allPosts) return { paths: [], fallback: false };

  const paths = allPosts.map((post) => ({
    params: { slug: post.slug },
  }));
  // paths: [
  //   { params: { slug: "first-post" } },
  //   { params: { slug: "second-post" } },
  //   { params: { slug: "third-post" } },
  // ]

  return {
    paths,
    fallback: false //ページが見つからなかった場合に404Not Foundを表示 TrueにするとHTMLページを表示
  }
}

type Props = {
  params: {
    slug: string;
  }
}

// getStaticPropsは、Next.jsの静的生成（Static Generation）機能の一部であり、ビルド時にデータを取得してページに渡すために使われます。
// getStaticPropsが呼ばれる際には、コンテキストオブジェクトが引数として渡され、このコンテキストオブジェクトにはさまざまな情報が含まれています。
// コードの中の({params}: any)は、このコンテキストオブジェクトからparamsプロパティを分割代入しています。
// ここでのparamsは、動的ルートのページで使用されるパラメータです。
// getStaticPropsで受け取るparamsには{ slug: 'some-value' }のように、URLの動的部分が含まれます。
export const getStaticProps = async ({ params }: Props) => {
  const post = await getSinglePost(params.slug)
  return {
    props: {
      post,
    },
    // ISR(１時間ごとに再更新する)
    // ブログの更新頻度を考えて再更新頻度を実装していく
    revalidate: 60 * 60 * 6,
  };
};

type PostProps = {
  post: {
    metadata: {
      id: string,
      title: string;
      date: string;
      description: string;
      tags: string[];
    },
    markdown: {
      parent: string;
    },
  },
};

const Post: React.FC<PostProps> = ({ post }) => {
  const navigate = usePreventDoubleNavigation();

  // const refl = useRef<SyntaxHighlighter>(null);

  return (
    <section className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">{post.metadata.title}</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">Posted date at {post.metadata.date}</span>
      <br />
      {post.metadata.tags.map((tag: string, index: number) => (
        <span key={index}
          className='text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block mr-2 cursor-pointer'
          onClick={() => navigate(`/posts/tag/${tag}/page/1`)}>
          {tag}
        </span>
      ))}
      <div className="mt-10 font-medium">
        <ReactMarkdown children={post.markdown.parent}
          components={{
            code(props) {
              const { children, className, node, ref, ...rest } = props
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <SyntaxHighlighter
                  // ref={refl}
                  {...rest}
                  PreTag="div"
                  children={String(children).replace(/\n$/, '')}
                  language={match[1]}
                  style={vscDarkPlus}
                />

              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            }
          }}></ReactMarkdown>
        <span className='pb-20 block mt-3 text-sky-900 cursor-pointer'
          onClick={() => navigate('/')}>
          ←ホームに戻る
        </span>
      </div>
    </section>
  )
}

export default Post; 