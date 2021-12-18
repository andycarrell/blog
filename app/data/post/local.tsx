import path from "path";
import fs from "fs/promises";

import type { FileType } from "./github";

// relative to the server output not the source!
const postsPath = path.join(__dirname, "../..", "posts");

export async function getPost(filename: string): Promise<FileType> {
  const filepath = path.join(postsPath, filename);
  const file = await fs.readFile(filepath);

  return {
    name: filename,
    contents: file.toString(),
  };
}

export async function getPosts(): Promise<FileType[]> {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await getPost(filename);

      return file;
    })
  );
}
