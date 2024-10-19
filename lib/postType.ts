type Tag = {
  name: string;
}

type NotionPost = {
  id: string;
  properties: {
    Name: {
      title: [{
        plain_text: string;
      }]
    };
    description: {
      rich_text: [{
        plain_text: string;
      }]
    };
    Date: {
      date: {
        start: string; // date型
      }
    };
    slug: {
      rich_text: [{
        plain_text: string;
      }]
    };
    tags: {
      multi_select: Tag[];
    }
  }
}
