import { Box, Stack } from "@chakra-ui/core";
import Head from "next/head";

import {
  CodeBlock,
  CodeInline,
  Dash,
  ExternalLink,
  Heading1,
  Heading2,
  Paragraph,
  Quote,
  UnorderedList,
} from "components/typography";

const TITLE = "Publishing an NPM package on GitHub";

export const SEO = () => (
  <Head>
    <title>{TITLE}</title>
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
      <Box maxWidth={660} marginX="auto" marginY={[5, 5, 6, 8]}>
        <Heading1>{TITLE}</Heading1>
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
      <Heading2>Overview</Heading2>
      <Paragraph>
        Make sure you have a build (or bundle, what's really the difference?) of
        your library code that you're happy to publish, then double check
        packages are available for your repository. As far as I know{" "}
        <ExternalLink href="https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/using-github-packages-with-github-actions">
          only some legacy plans are excluded
        </ExternalLink>
        .
      </Paragraph>
      <Paragraph>
        We'll create a GitHub action that builds and publishes your library on
        push to master <i>and only if</i> the library files have changed. We'll
        extend the action to perform a "dry run" of publishing the package, so
        you can ensure everything will run as expected before you commit.
      </Paragraph>
      <Paragraph>
        Finally, we'll guide you through how to access the GitHub NPM registry
        both locally and in continuous integration, and discuss some of the
        stumbling blocks we encountered along the way.
      </Paragraph>
      <Paragraph>
        The complete GitHub action code is as follows. I've left some comments,
        but the rest of the post will explain what we did and why.
      </Paragraph>
      <CodeBlock language="yaml">
        {`
          # .github/workflows/publish-library.yml
          name: Library build & publish
          on:
            pull_request:
              paths:
                - 'library/**'
            push:
              branches:
                # or your 'default' branch
                - master
              paths:
                - 'library/**'\n
          jobs:
            build:
              name: Build & publish
              runs-on: ubuntu-latest
              steps:
                - name: Checkout code
                  uses: actions/checkout@v1
                - name: Authenticate GitHub package registry
                  run: echo '//npm.pkg.github.com/:_authToken=\${{ secrets.GITHUB_TOKEN }}' > ~/.npmrc
                - name: Set short sha as environment variable
                  # we use this in our build script to ensure our versions are unique per push
                  run: echo ::set-env name=sha_short::$(git rev-parse --short \${{ github.sha }})
                - name: Setup node
                  uses: actions/setup-node@v1
                - name: Install
                  run: npm install
                - name: Verify
                  # we run eslint and tests
                  run: npm run lint && npm run test
                - name: Build
                  # we use rollup, so our script is "rollup -c rollup.config.js"
                  run: npm run build-library -- --version-suffix \${{ env.sha_short }}
                - name: Publish - dry run
                  run: npm publish output -- --dry-run
                - name: Publish
                  # only run this step on commit to master
                  if: github.ref == 'refs/heads/master' && github.event_name == 'push'
                  run: npm publish output
        `}
      </CodeBlock>
      <Heading2>Assumptions</Heading2>
      <Paragraph>
        As mentioned, make sure you have GitHub packages enabled. As far as I
        know, if you navigate to{" "}
        <CodeInline>
          {"https://github.com/<user-name>/<repo-name>/packages"}
        </CodeInline>{" "}
        and you see the following screen, you're good to go:
      </Paragraph>
      <Quote>Insert image here</Quote>
      <Paragraph>
        If not, you may have to dive into your plan and even reach out to GitHub
        for help. On that note, if you're developing a package in a private
        repository{" "}
        <ExternalLink href="https://github.com/features/packages#pricing">
          double check prices
        </ExternalLink>{" "}
        and usage for your current plan, otherwise if public, at the time of
        writing it's all free! Secondly, in this blog post, I assume you're
        already able to bundle / build your library code into a form that you're
        happy to publish. How we configure and test our library warrants a blog
        post itself, so for demonstration purposes I'll reference a custom NPM
        script:
      </Paragraph>
      <Box marginLeft={[4, 4, 6, 6]} padding={2}>
        <CodeInline>npm run build-library</CodeInline>
      </Box>
      <Paragraph>
        In our case, our build uses{" "}
        <ExternalLink href="https://rollupjs.org/">Rollup</ExternalLink> and
        outputs to a folder called <CodeInline>output</CodeInline>. I recommend
        wrapping your build process in a custom script and referencing it in
        GitHub actions in a similar way.
      </Paragraph>
      <Paragraph>And of course this assumes you're using GitHub!</Paragraph>
      <Heading2>Create a GitHub action</Heading2>
      <Paragraph>
        If you're familiar with GitHub actions, and/or you understand what's
        going on in the example code then you can probably skip the following.
        More information on the syntax mentioned can be{" "}
        <ExternalLink href="https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions/">
          found in the documentation
        </ExternalLink>
        .
      </Paragraph>
      <Paragraph>
        We start by defining a{" "}
        <ExternalLink href="https://en.wikipedia.org/wiki/YAML/">
          YAML
        </ExternalLink>{" "}
        file in the GitHub workflows directory{" "}
        <CodeInline>.github/workflows</CodeInline> From the docs:
      </Paragraph>
      <Quote>
        You must store workflow files in the{" "}
        <CodeInline>.github/workflows</CodeInline> directory of your repository.
      </Quote>
      <Paragraph>
        The name of the file doesn't matter, we'll call it something like
        <CodeInline>publish-library.yml</CodeInline>. Similarly, the name of the
        action isn't too significant, although it does appear in the GitHub
        actions UI, so an identifiable name will help:
      </Paragraph>
      <CodeBlock language="yaml">
        {`
          name: Library build & publish
          on:
            push:
              branches:
                # or your 'default' branch
                - master
              paths:
                - 'library/**'
        `}
      </CodeBlock>
      <Paragraph>
        The "on" configuration defines which{" "}
        <ExternalLink href="https://help.github.com/en/actions/reference/events-that-trigger-workflows/">
          events will trigger your workflow
        </ExternalLink>
        . We further refine the conditions in which workflow is triggered
        <Dash />
        in this example, any git push, to the master branch, where file(s) in
        the library or directory have changed.
      </Paragraph>
      <Paragraph>
        A GitHub action needs at least one "job" (with steps) to run anything.
        Again, the job id and name aren't so important, but will identify the
        job in the GitHub UI:
      </Paragraph>
      <CodeBlock language="yaml">
        {`
          # ...
          # on: ...\n
          jobs:
            # job 'id'
            build:
              name: Build & publish
              runs-on: ubuntu-latest
              steps:
                - name: Checkout code
                  uses: actions/checkout@v1
        `}
      </CodeBlock>
      <Paragraph>
        If we want to run an action with or against our code we need to check it
        out first. Whilst GitHub doesn't do that by default, we can simply
        reference{" "}
        <ExternalLink href="https://github.com/actions/checkout/">
          the checkout action
        </ExternalLink>
        .
      </Paragraph>
      <Quote>
        This action checks-out your repository under{" "}
        <CodeInline>$GITHUB_WORKSPACE</CodeInline>, so your workflow can access
        it.
      </Quote>
      <Paragraph>
        Also note the{" "}
        <ExternalLink href="https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions#jobsjob_idruns-on">
          runs-on property
        </ExternalLink>
        <Dash />
        this is required and specifies the type of machine to run the job on.
        There's a few options, but for a node / npm based action{" "}
        <CodeInline>ubuntu-latest</CodeInline> will work fine.
      </Paragraph>
      <Paragraph>
        To publish a package, we need to authenticate our action for the GitHub
        NPM registry. The{" "}
        <ExternalLink href="https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-to-github-packages">
          official documentation
        </ExternalLink>{" "}
        recommends a couple of ways of doing this, neither of which were
        practical for use in an continuous integration (CI) context. The
        solution we found involves appending the{" "}
        <CodeInline>
          <ExternalLink href="https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token">
            GITHUB_TOKEN
          </ExternalLink>
        </CodeInline>{" "}
        to the <CodeInline>.npmrc</CodeInline> file <i>after checkout</i>, which
        avoids having to commit sensitive tokens. We can acheive this using bash
        syntax to overwrite a file:
      </Paragraph>
      <Box marginLeft={[4, 4, 6, 6]} padding={2}>
        <CodeInline>echo '...' > ~/.npmrc</CodeInline>
      </Box>
      <Paragraph>
        We run this immediately after checking out our code:
      </Paragraph>
      <CodeBlock language="yaml">
        {`
          # ...
          # on: ...\n
          jobs:
            build:
              name: Build & publish
              runs-on: ubuntu-latest
              steps:
                - name: Checkout code
                  uses: actions/checkout@v1
                - name: Authenticate GitHub package registry
                  run: echo '//npm.pkg.github.com/:_authToken=\${{ secrets.GITHUB_TOKEN }}' > ~/.npmrc
                # - name: Set short sha as environment variable
                #   we use this in our build script to ensure our versions are unique per push
                #   run: echo ::set-env name=sha_short::$(git rev-parse --short \${{ github.sha }})
        `}
      </CodeBlock>
      <Paragraph>
        For reference, the{" "}
        <ExternalLink href="https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-to-github-packages">
          recommended approaches for authenticating
        </ExternalLink>{" "}
        are:
      </Paragraph>
      <UnorderedList>
        <UnorderedList.Item>
          <CodeInline>
            <ExternalLink href="https://docs.npmjs.com/cli/adduser/">
              npm login
            </ExternalLink>
          </CodeInline>
          <Dash />
          requires CLI input so won't work in CI.
        </UnorderedList.Item>
        <UnorderedList.Item>
          <ExternalLink href="https://www.graphql-tools.com/docs/generate-schema/">
            Editing your per-user
          </ExternalLink>{" "}
          <CodeInline>~/.npmrc</CodeInline> file
          <Dash />
          requires committing sensitive auth tokens in the project's{" "}
          <CodeInline>~/.npmrc</CodeInline> file.
        </UnorderedList.Item>
      </UnorderedList>
    </Stack>
  );
}
