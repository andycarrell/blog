import { marked } from "marked";
import invariant from "tiny-invariant";
import parseFrontMatter from "front-matter";
import type { FrontMatterResult } from "front-matter";

const githubUrl =
  "https://api.github.com/repos/andycarrell/blog/contents/posts";
// whilst we're working on a branch, we need to query by that branch
const query = "?ref=remix";

export type PostType = {
  slug: string;
  title: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

type PostMarkdownFile = {
  name: `${string}.md`;
};

function isValidPostAttributes(
  attributes: unknown
): attributes is PostMarkdownAttributes {
  return "title" in (attributes as PostMarkdownAttributes);
}

function isValidPostMarkdownFile(file: unknown): file is PostMarkdownFile {
  return (
    "name" in (file as PostMarkdownFile) &&
    (file as PostMarkdownFile).name.endsWith(".md")
  );
}

async function getPostFromGitHub(
  fileName: string
): Promise<FrontMatterResult<PostMarkdownAttributes>> {
  const res = await fetch(`${githubUrl}/${fileName}${query}`, {
    headers: {
      Accept: "application/vnd.github.v3.raw",
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const { attributes, ...rest } = parseFrontMatter(await res.text());

  invariant(
    isValidPostAttributes(attributes),
    `${fileName} has bad meta data!`
  );

  return { attributes, ...rest };
}

async function getPostsFromGitHub() {
  const res = await fetch(`${githubUrl}${query}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const posts: PostMarkdownFile[] = (await res.json()).filter(
    (file: unknown) => {
      invariant(
        isValidPostMarkdownFile(file),
        `${file} is not a valid markdown file!`
      );

      return file;
    }
  );

  return posts;
}

export async function getPosts() {
  const data = await getPostsFromGitHub();

  return Promise.all(
    data.map(async ({ name }) => {
      const { attributes } = await getPostFromGitHub(name);

      return { slug: name.replace(/\.md$/, ""), title: attributes.title };
    })
  );
}

export async function getPost(slug: string) {
  const { attributes, body } = await getPostFromGitHub(`${slug}.md`);

  return { slug, html: marked(body), title: attributes.title };
}
