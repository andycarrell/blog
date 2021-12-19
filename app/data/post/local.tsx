import path from "path";
import fs from "fs/promises";

import type { PostFilenameType, PostFileType } from "./PostFile";

// relative to the server output not the source!
const postsPath = path.join(__dirname, "../..", "posts");

export async function getPost(
  filename: PostFilenameType
): Promise<PostFileType> {
  const filepath = path.join(postsPath, filename);
  const file = await fs.readFile(filepath);

  return {
    name: filename,
    contents: file.toString(),
  };
}

export async function getPosts(): Promise<PostFileType[]> {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await getPost(filename as PostFilenameType);

      return file;
    })
  );
}
