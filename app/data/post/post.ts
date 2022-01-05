import { marked } from "marked";
import invariant from "tiny-invariant";
import parseFrontMatter from "front-matter";
import type { FrontMatterResult } from "front-matter";

import * as github from "./github";
import * as local from "./local";

import type { PostFilenameType } from "./PostFile";

const dataSource = process.env.DATA_SOURCE === "local" ? local : github;

export type PostType = {
  slug: string;
  title: string;
};

export type PostMarkdownAttributes = {
  title: string;
  description: string;
};

function isValidPostAttributes(
  attributes: unknown
): attributes is PostMarkdownAttributes {
  return "title" in (attributes as PostMarkdownAttributes);
}

async function getMarkdownPost(
  filename: PostFilenameType
): Promise<FrontMatterResult<PostMarkdownAttributes>> {
  const { contents } = await dataSource.getPost(filename);
  const { attributes, ...rest } = parseFrontMatter(contents);

  invariant(
    isValidPostAttributes(attributes),
    `${filename} has bad meta data!`
  );

  return { attributes, ...rest };
}

export async function getPosts() {
  const data = await dataSource.getPosts();

  return Promise.all(
    data.map(async ({ name }) => {
      const { attributes } = await getMarkdownPost(name);

      return {
        slug: name.replace(/\.mdx$/, ""),
        title: attributes.title,
      };
    })
  );
}

export async function getPost(slug: string) {
  const { attributes, body } = await getMarkdownPost(`${slug}.mdx`);

  return {
    slug,
    html: marked(body),
    title: attributes.title,
    description: attributes.description,
  };
}
