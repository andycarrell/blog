import Error from "next/error";
import { useRouter } from "next/router";
import Post2, { SEO } from "posts/Post2";
import { BlogPost } from "components/layout";

const draftsFor = {
  "publishing-an-npm-library-on-github": [Post2, SEO],
};

export function getStaticPaths() {
  if (Number(process.env.DRAFTS)) {
    return {
      paths: Object.keys(draftsFor).map((s) => `/posts/drafts/${s}`),
      fallback: false,
    };
  }

  return { paths: [], fallback: false };
}

export function getStaticProps() {
  return { props: {} };
}

export default function Index() {
  const { query } = useRouter();
  const [Post, SEO] = draftsFor[query.slug];

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
