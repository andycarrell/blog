import path from "path";
import fs from "fs/promises";

import type {
  GetPostFileFunction,
  GetPostFilesFunction,
  PostFilenameType,
} from "./PostFile";

// relative to the server output not the source!
const postsPath = path.join(__dirname, "../..", "posts");

export const getPost: GetPostFileFunction = async (filename) => {
  const filepath = path.join(postsPath, filename);
  const file = await fs.readFile(filepath);

  return {
    name: filename,
    contents: file.toString(),
  };
};

export const getPosts: GetPostFilesFunction = async () => {
  const dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async (filename) => {
      const file = await getPost(filename as PostFilenameType);

      return file;
    })
  );
};
