import Error from "next/error";
import { useRouter } from "next/router";

import Page from "components/Page";
import Post1 from "posts/Post1";

const postFor = {
  "mocking-graphql-in-cypress": Post1,
};

export function getStaticPaths() {
  return {
    paths: Object.keys(postFor).map((s) => `/posts/${s}`),
    fallback: false,
  };
}

export function getStaticProps() {
  return { props: {} };
}

export default function Index() {
  const { query } = useRouter();
  const Post = postFor[query.slug];

  if (Post) {
    return (
      <Page>
        <Post />
      </Page>
    );
  }

  return <Error statusCode={404} />;
}
