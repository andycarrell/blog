import { marked } from "marked";
import invariant from "tiny-invariant";
import parseFrontMatter from "front-matter";
import type { FrontMatterResult } from "front-matter";

import * as github from "./github";
import * as local from "./local";

const dataSource = process.env.DATA_SOURCE === "local" ? local : github;

export type PostType = {
  slug: string;
  title: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

function isValidPostAttributes(
  attributes: unknown
): attributes is PostMarkdownAttributes {
  return "title" in (attributes as PostMarkdownAttributes);
}

async function getMarkdownPost(
  fileName: string
): Promise<FrontMatterResult<PostMarkdownAttributes>> {
  const { contents } = await dataSource.getPost(fileName);
  const { attributes, ...rest } = parseFrontMatter(contents);

  invariant(
    isValidPostAttributes(attributes),
    `${fileName} has bad meta data!`
  );

  return { attributes, ...rest };
}

export async function getPosts() {
  const data = await dataSource.getPosts();

  return Promise.all(
    data.map(async ({ name }) => {
      const { attributes } = await getMarkdownPost(name);

      return { slug: name.replace(/\.md$/, ""), title: attributes.title };
    })
  );
}

export async function getPost(slug: string) {
  const { attributes, body } = await getMarkdownPost(`${slug}.md`);

  return { slug, html: marked(body), title: attributes.title };
}
