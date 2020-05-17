import Error from "next/error";
import { useRouter } from "next/router";
import Post1, { SEO } from "posts/Post1";
import { BlogPost } from "components/layout";

const postFor = {
  "mocking-graphql-in-cypress": [Post1, SEO],
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
  const [Post, SEO] = postFor[query.slug];

  if (Post) {
    return (
      <BlogPost>
        <SEO />
        <Post />
      </BlogPost>
    );
  }

  return <Error statusCode={404} />;
}
