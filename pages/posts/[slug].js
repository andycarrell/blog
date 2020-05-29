import Error from "next/error";
import { useRouter } from "next/router";
import Post1, { SEO as SEOPost1 } from "posts/Post1";
import Post2, { SEO as SEOPost2 } from "posts/Post2";
import { BlogPost } from "components/layout";

const postFor = {
  "mocking-graphql-in-cypress": [Post1, SEOPost1],
  "mocking-graphql-in-cypress-v5": [Post2, SEOPost2],
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
