import type { PostFilenameType, PostFileType } from "./PostFile";

const githubUrl =
  "https://api.github.com/repos/andycarrell/blog/contents/posts";
// whilst we're working on a branch, we need to query by that branch
const query = "ref=remix";

function isValidPostFile(file: unknown): file is PostFileType {
  return (
    "name" in (file as PostFileType) &&
    (file as PostFileType).name.endsWith(".md")
  );
}

export async function getPost(
  filename: PostFilenameType
): Promise<PostFileType> {
  const res = await fetch(`${githubUrl}/${filename}?${query}`, {
    headers: {
      Accept: "application/vnd.github.v3.raw",
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  return { name: filename, contents: await res.text() };
}

export async function getPosts() {
  const res = await fetch(`${githubUrl}?${query}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const data = await res.json();

  return Promise.all<PostFileType>(
    data.filter(isValidPostFile).map(async ({ name }: PostFileType) => {
      const file = await getPost(name);

      return file;
    })
  );
}
