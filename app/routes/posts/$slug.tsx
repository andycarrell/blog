import { useLoaderData } from "remix";
import type { LoaderFunction, MetaFunction } from "remix";
import invariant from "tiny-invariant";

import { getPost } from "~/data/post";

export const loader: LoaderFunction = ({ params }) => {
  const { slug } = params;

  invariant(slug, "expected params.slug");

  return getPost(slug);
};

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `${data.title} - andycarrell`,
  };
};

export default function PostSlug() {
  const post = useLoaderData();

  return <div dangerouslySetInnerHTML={{ __html: post.html }} />;
}
