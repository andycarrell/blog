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
  Callout,
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

export default function Post3() {
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
                - "library/**"
            push:
              branches:
                # or your 'default' branch
                - master
              paths:
                - "library/**"\n
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
                  run: echo ::set-env name=sha_short::$(git rev-parse --short=7 \${{ github.sha }})
                - name: Setup node
                  uses: actions/setup-node@v1
                - name: Install
                  run: npm install
                - name: Verify
                  # these are custom scripts to run eslint and tests
                  run: npm run lint && npm run test
                - name: Build
                  # we use rollup, so our script is 'rollup -c rollup.config.js'
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
        <CodeInline display="inline">
          https://github.com/&lt;user-name&gt;/&lt;repo-name&gt;/packages
        </CodeInline>{" "}
        and you see the following screen, you're good to go:
      </Paragraph>
      <Box padding={4}>
        <img
          src="/publishing-an-npm-package-on-github/github-packages.png"
          loading="lazy"
          alt="Github Packages 'Getting Started' screen"
        />
      </Box>
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
                - "library/**"
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
        <CodeInline>echo '...' &gt; ~/.npmrc</CodeInline>
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
                # Setup node ...
                # Install ...
                # Verify & build ...
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
      <Paragraph>
        To run node in our GitHub action, we need to set it up
        <Dash />
        there's{" "}
        <ExternalLink href="https://github.com/actions/setup-node/">
          an action for that too
        </ExternalLink>
        :
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
                # Checkout ...
                # Authenticate ...
                - name: Setup node
                  uses: actions/setup-node@v1
        `}
      </CodeBlock>
      <Paragraph>
        Now, we can install, run any verification scripts, build the library and
        finally publish!
      </Paragraph>
      <CodeBlock language="yaml">
        {`
          # .github/workflows/publish-library.yml
          name: Library build & publish
          on:
            push:
              branches:
                # or your 'default' branch
                - master
              paths:
                - "library/**"\n
          jobs:
            build:
              name: Build & publish
              runs-on: ubuntu-latest
              steps:
                - name: Checkout code
                  uses: actions/checkout@v1
                - name: Authenticate GitHub package registry
                  run: echo '//npm.pkg.github.com/:_authToken=\${{ secrets.GITHUB_TOKEN }}' > ~/.npmrc
                - name: Setup node
                  uses: actions/setup-node@v1
                - name: Install
                  run: npm install
                - name: Verify
                  # these are custom scripts to run eslint and tests
                  run: npm run lint && npm run test
                - name: Build
                  # we use rollup, so our script is 'rollup -c rollup.config.js'
                  run: npm run build-library
                - name: Publish
                  run: npm publish output
        `}
      </CodeBlock>
      <Callout>
        At this point you should be publishing every time make changes to your
        library and push to master
        <Dash />
        provided you update the library version with each change. Carefully
        consider if this is an appropriate publishing frequency for your
        library.
      </Callout>
      <Paragraph>
        Our motivation for publishing in this way is to minimise the time (and
        effort) making a change and consuming it in another project. The cost of
        this is we have many versions each containing small changes, which are
        also often undocumented. This doesn't make for a good consumer
        experience. However, in this case it's a library for internal use only,
        and generally developers making the changes are also consuming them.
        It's also something we can definitely iterate on.
      </Paragraph>
      <Paragraph>
        To improve the developer experience of contributing to our library
        <Dash />
        we added the following features:
      </Paragraph>
      <UnorderedList>
        <UnorderedList.Item>
          Early feedback
          <Dash />
          if a developer is making a change, can we let them know if the library
          will publish successfully before committing to master.
        </UnorderedList.Item>
        <UnorderedList.Item>
          Automated unique versioning
          <Dash />
          for a given change, we assume the developer wants a new version
          released, without the chore of releasing it themselves.
        </UnorderedList.Item>
      </UnorderedList>
      <Heading2>Pull request dry run</Heading2>
      <Paragraph>
        We can update our GitHub action so that on every pull request we run all
        the steps, except for actually publishing a new version.
      </Paragraph>
      <Callout>
        For even earlier feedback, take a look at{" "}
        <CodeInline backgroundColor="inherit">
          <ExternalLink href="https://github.com/nektos/act/">
            nektos/act
          </ExternalLink>
        </CodeInline>
        . It allows you to run actions locally
        <Dash />
        be careful you don't accidentally publish a new version!
      </Callout>
      <Paragraph>
        First, we need to trigger the action on pull request as well as push:
      </Paragraph>
      <CodeBlock language="yaml">
        {`
          name: Library build & publish
          on:
            pull_request:
              paths:
                - "library/**"
            push:
              branches:
                # or your 'default' branch
                - master
              paths:
                - "library/**"\n
          jobs:
            # ...
        `}
      </CodeBlock>
      <Paragraph>
        Then we need to{" "}
        <i>only run the publish step when a push (to master) event happens</i>.
      </Paragraph>
      <CodeBlock language="yaml">
        {`
          # .github/workflows/publish-library.yml
          name: Library build & publish
          on:
            pull_request:
              paths:
                - "library/**"
            push:
              branches:
                # or your 'default' branch
                - master
              paths:
                - "library/**"\n
          jobs:
            build:
              name: Build & publish
              runs-on: ubuntu-latest
              steps:
                # Checkout ...
                # Authenticate ...
                # Setup node ...
                # Install, verify & build ...
                - name: Publish
                  # only run this step on commit to master
                  if: github.ref == 'refs/heads/master' && github.event_name == 'push'
                  run: npm publish output
        `}
      </CodeBlock>
      <Paragraph>
        Finally, on pull requests we can perform a "dry run" of publishing:
      </Paragraph>
      <Quote>
        <ExternalLink href="https://docs.npmjs.com/cli/publish/">
          <CodeInline>[--dry-run]</CodeInline> As of npm@6, does everything
          publish would do except actually publishing to the registry.
        </ExternalLink>
      </Quote>
      <Paragraph>
        This is useful as it shows whether the change will actually build and
        publish successfully.
      </Paragraph>
      <Paragraph>Our action with pull request feedback:</Paragraph>
      <CodeBlock language="yaml">
        {`
          # .github/workflows/publish-library.yml
          name: Library build & publish
          on:
            pull_request:
              paths:
                - "library/**"
            push:
              branches:
                # or your 'default' branch
                - master
              paths:
                - "library/**"\n
          jobs:
            build:
              name: Build & publish
              runs-on: ubuntu-latest
              steps:
                - name: Checkout code
                  uses: actions/checkout@v1
                - name: Authenticate GitHub package registry
                  run: echo '//npm.pkg.github.com/:_authToken=\${{ secrets.GITHUB_TOKEN }}' > ~/.npmrc
                - name: Setup node
                  uses: actions/setup-node@v1
                - name: Install
                  run: npm install
                - name: Verify
                  # these are custom scripts to run eslint and tests
                  run: npm run lint && npm run test
                - name: Build
                  # we use rollup, so our script is 'rollup -c rollup.config.js'
                  run: npm run build-library
                - name: Publish - dry run
                  # this step runs every time, but only takes a few seconds
                  run: npm publish output -- --dry-run
                - name: Publish
                  # only run this step on commit to master
                  if: github.ref == 'refs/heads/master' && github.event_name == 'push'
                  run: npm publish output
        `}
      </CodeBlock>
      <Heading2>Versioning</Heading2>
      <Paragraph>
        As the action stands, the{" "}
        <ExternalLink href="https://docs.npmjs.com/cli/publish/">
          publish step will fail
        </ExternalLink>{" "}
        unless the developer remembers to update the version with each change.
      </Paragraph>
      <Quote>
        Once a package is published with a given name and version, that specific
        name and version combination can never be used again, even if it is
        removed with npm-unpublish.
      </Quote>
      <Paragraph>
        Additionally, if multiple developers are working on the library at the
        same time, they'll need to coordinate to ensure that they don't land on
        the same new version, or that a later version lands before an earlier
        one.
      </Paragraph>
      <Paragraph>
        These issues highlight a manual process that could be improved by
        automation
        <Dash />
        both the choice of version, and applying a new version with each change.
        To achieve this, we apply the constraint that each of our versions
        consists of a standard{" "}
        <ExternalLink href="https://semver.org/">
          semantic version
        </ExternalLink>{" "}
        and a unqiue suffix, which is the (short){" "}
        <ExternalLink href="https://blog.thoughtram.io/git/2014/11/18/the-anatomy-of-a-git-commit.html/">
          Git SHA
        </ExternalLink>
        .
      </Paragraph>
      <Box marginLeft={[4, 4, 6, 6]} padding={2}>
        <CodeInline>
          "@&lt;organisation&gt;/&lt;library&gt;": "0.1.0-3b4c0a0"
        </CodeInline>
      </Box>
      <Paragraph>
        Our build script takes a version suffix as a command line argument and
        appends that to a semantic version defined in code. Prior to that, we
        parse the first 7 digits of the Git SHA and assign it to an environment
        variable:
      </Paragraph>
      <CodeBlock language="yaml">
        {`
          # .github/workflows/publish-library.yml
          name: Library build & publish
          on:
            # pull_request ...
            # push: ...\n
          jobs:
            build:
              name: Build & publish
              runs-on: ubuntu-latest
              steps:
                # Checkout ...
                # Authenticate ...
                - name: Set short sha as environment variable
                  run: echo ::set-env name=sha_short::$(git rev-parse --short=7 \${{ github.sha }})
                # Setup node ...
                # Install, verify ...
                - name: Build
                  run: npm run build-library -- --version-suffix \${{ env.sha_short }}
                # Publish - dry run ...
                # Publish ...
        `}
      </CodeBlock>
      <Callout>
        If you're using{" "}
        <ExternalLink href="https://rollupjs.org/">Rollup</ExternalLink> and are
        extracting a library from a larger project, or need to manipulate the
        final <CodeInline backgroundColor="inherit">package.json</CodeInline>, I
        recommend the rollup plugin{" "}
        <CodeInline backgroundColor="inherit">
          <ExternalLink href="https://github.com/vladshcherbin/rollup-plugin-generate-package-json#readme">
            generate-package-json
          </ExternalLink>
        </CodeInline>
        .<br />
        It allows you to overwrite the contents of the current file, as well as
        automatically populating dependencies that are used by your build.
      </Callout>
      <Paragraph>The complete action is as follows:</Paragraph>
      <CodeBlock language="yaml">
        {`
          # .github/workflows/publish-library.yml
          name: Library build & publish
          on:
            pull_request:
              paths:
                - "library/**"
            push:
              branches:
                # or your 'default' branch
                - master
              paths:
                - "library/**"\n
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
                  run: echo ::set-env name=sha_short::$(git rev-parse --short=7 \${{ github.sha }})
                - name: Setup node
                  uses: actions/setup-node@v1
                - name: Install
                  run: npm install
                - name: Verify
                  # these are custom scripts to run eslint and tests
                  run: npm run lint && npm run test
                - name: Build
                  # we use rollup, so our script is 'rollup -c rollup.config.js'
                  run: npm run build-library -- --version-suffix \${{ env.sha_short }}
                - name: Publish - dry run
                  run: npm publish output -- --dry-run
                - name: Publish
                  # only run this step on commit to master
                  if: github.ref == 'refs/heads/master' && github.event_name == 'push'
                  run: npm publish output
        `}
      </CodeBlock>
      <Heading2>Consuming your GitHub package</Heading2>
      <Paragraph>
        Consuming your NPM package requires adding the GitHub registry URL to
        your <CodeInline>.npmrc</CodeInline>:
      </Paragraph>
      <CodeBlock language="yaml">
        registry=https://npm.pkg.github.com/&lt;user-name&gt;
      </CodeBlock>
      <Paragraph>
        Find the latest version of your package under the packages tab of your
        projects's repository:
      </Paragraph>
      <Box marginLeft={[4, 4, 6, 6]} padding={2}>
        <CodeInline>
          https://github.com/&lt;user-name&gt;/&lt;repo-name&gt;/packages
        </CodeInline>
      </Box>
      <Paragraph>
        Add this version to the <CodeInline>package.json</CodeInline> of the
        project where you want to consume it.
      </Paragraph>
      <Paragraph>
        If your project's repository is private, then the package will be too.
        To give yourself access to install locally, you'll need to{" "}
        <ExternalLink href="https://docs.npmjs.com/cli/adduser">
          add an NPM registry user account
        </ExternalLink>
        .
      </Paragraph>
      <Paragraph>
        First, create a{" "}
        <ExternalLink href="https://github.com/settings/tokens/new">
          new GitHub token
        </ExternalLink>{" "}
        with the <CodeInline>read:packages</CodeInline> scope. Adding{" "}
        <CodeInline>write:packages</CodeInline> and{" "}
        <CodeInline>delete:packages</CodeInline> will be helpful if you plan on
        managing packages from the command line. Keep the access token handy for
        the next step.
      </Paragraph>
      <Paragraph>
        Next, enter the following commands into your terminal:
      </Paragraph>
      <CodeBlock language="none">
        {`
# cd into your root folder
cd ~

# authenticate for the GitHub package registry
npm adduser --registry=https://npm.pkg.github.com/ --scope=<user-name>

# command line will prompt you for your details
Username: <your github username>
Password: <paste github access token>
Email: (this IS public) <your github public email>
        `}
      </CodeBlock>
    </Stack>
  );
}
