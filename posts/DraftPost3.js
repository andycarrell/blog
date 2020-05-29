import { Box, Stack } from "@chakra-ui/core";
import Head from "next/head";

import { Dash, Heading1, Paragraph, ExternalLink } from "components/typography";

export const SEO = () => (
  <Head>
    <title>Publishing on GitHub package management for NPM</title>
    <meta
      content="Follow this guide to find out how to publish and consume libraries from GitHub's NPM package registry."
      name="description"
      key="description"
    />
  </Head>
);

export default function Post1() {
  return (
    <Stack>
      <Box marginY={[5, 5, 6, 8]}>
        <Heading1>Publishing on GitHub package management for NPM</Heading1>
      </Box>
      <Paragraph>
        This is a guide to publishing and consuming a node package / library to{" "}
        <ExternalLink href="https://help.github.com/en/packages/publishing-and-managing-packages/about-github-packages">
          the GitHub package registry
        </ExternalLink>
        , specifically for{" "}
        <ExternalLink href="https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages">
          NPM
        </ExternalLink>
        . The combination of GitHub packages and{" "}
        <ExternalLink href="https://github.com/features/actions">
          actions
        </ExternalLink>{" "}
        makes sharing code between repositories easier than ever before. I
        encourage you to have a good read of both sets of documentation
        <Dash />
        all the information you need is in the official documentation, or
        associated forums. This post distills down that information, focuses in
        on NPM and outlines the process that's working for the frontend team at{" "}
        <ExternalLink href="https://www.jasper.io/">Jasper</ExternalLink>.
      </Paragraph>
    </Stack>
  );
}
