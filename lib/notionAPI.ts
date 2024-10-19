import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/constants";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

// notionへの認証
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// マークダウンの認証
const n2m = new NotionToMarkdown({ notionClient: notion })

// 全ての投稿を取得
export const getAllPosts = async (): Promise<ReturnType<typeof getPageMetaData>[]> => {
  if (!process.env.NOTION_DATABASE_ID) return [];
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    page_size: 100,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      }
    ]
  });

  const allPosts: NotionPost[] = response.results as unknown as NotionPost[];

  return allPosts.map(getPageMetaData);
};

// メタデータの取得
const getPageMetaData = (post: NotionPost) => {
  const getTags = (tags: Tag[]) => {
    const allTags = tags.map((tag: Tag) => {
      return tag.name;
    })
    return allTags;
  }

  return {
    id: post.id,
    title: post.properties.Name.title[0].plain_text,
    description: post.properties.description.rich_text[0].plain_text,
    date: post.properties.Date.date.start,
    slug: post.properties.slug.rich_text[0].plain_text,
    tags: getTags(post.properties.tags.multi_select),
  };
};

// 個別の投稿を表示
export const getSinglePost = async (slug: string) => {
  if (!process.env.NOTION_DATABASE_ID) return;
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "slug",
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });

  if (!response.results[0]) return
  const page: NotionPost = response.results[0] as unknown as NotionPost;
  if (!page) return;
  const metadata = getPageMetaData(page);
  // console.log(metadata);

  // マークダウンの取得
  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);
  console.log(mdString);

  return {
    metadata,
    markdown: mdString,
  };
};

// Topページ用の記事の取得(4つ)
export const getPostsForTopPage = async (pageSize: number) => {
  const allPosts = await getAllPosts();
  const fourPosts = allPosts.slice(0, pageSize);
  return fourPosts;
}

// ページ番号に応じた記事取得
export const getPostsByPage = async (page: number) => {
  const allPosts = await getAllPosts();

  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

  return allPosts.slice(startIndex, endIndex);
}

export const getNumberOfPages = async () => {
  const allPosts = await getAllPosts();

  //  Math.floorは小数点のある数値の整数部分のみを返す
  const numberOfPages = Math.floor(allPosts.length / NUMBER_OF_POSTS_PER_PAGE) +
    ((allPosts.length % NUMBER_OF_POSTS_PER_PAGE) > 0 ? 1 : 0);
  console.log("Total pages:", numberOfPages);
  return numberOfPages;
};

// 引数で渡されたタグを含む投稿を取得
export const getPostsByTagAndPage = async (tagName: string, page: number) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) => post.tags.find((tag: string) => tag === tagName));

  console.log(posts); // フィルタリングされた投稿を確認


  const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
  const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;

  return posts.slice(startIndex, endIndex);
};

export const getNumberOfPagesByTag = async (tagName: string) => {
  const allPosts = await getAllPosts();
  const posts = allPosts.filter((post) =>
    post.tags.find((tag: string) => tag === tagName)
  );

  const numberOfPages = Math.floor(posts.length / NUMBER_OF_POSTS_PER_PAGE) +
    ((posts.length % NUMBER_OF_POSTS_PER_PAGE) > 0 ? 1 : 0);
  return numberOfPages;
};

export const getAllTags = async () => {
  const allPosts = await getAllPosts();

  // flatMapを使うことによって配列を一元化する（二重配列が中身が全て取り出され普通の配列になる）
  const allTagsDuplicationLists = allPosts.flatMap((post) => post.tags);

  // リストの重複をなくす
  const set = new Set(allTagsDuplicationLists);
  const allTagsList = Array.from(set);
  console.log(allTagsList);

  return allTagsList;
}