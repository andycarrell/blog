const githubUrl =
  "https://api.github.com/repos/andycarrell/blog/contents/posts";
// whilst we're working on a branch, we need to query by that branch
const query = "?ref=remix";

export type FileType = {
  name: string;
  contents: string;
};

export async function getPost(fileName: string): Promise<FileType> {
  const res = await fetch(`${githubUrl}/${fileName}${query}`, {
    headers: {
      Accept: "application/vnd.github.v3.raw",
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  return { name: fileName, contents: await res.text() };
}

export async function getPosts() {
  const res = await fetch(`${githubUrl}${query}`, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
    },
  });

  const data = await res.json();

  return Promise.all<FileType>(
    data.map(async ({ name }: { name: string }) => {
      const file = await getPost(name);

      return file;
    })
  );
}
