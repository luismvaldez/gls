export type Commit = {
    message: string;
    committer: {
      date: string;
    };
    author: {
      avatar_url: string;
      date: string;
    };
  }