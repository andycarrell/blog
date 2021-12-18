import { Link, useLoaderData } from "remix";
import { getPosts } from "~/data/post";
import type { PostType } from "~/data/post";

export async function loader(): Promise<PostType[]> {
  return getPosts();
}

export default function Posts() {
  const posts = useLoaderData<PostType[]>();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
