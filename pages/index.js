import { Box, Text, Stack, Link } from "@chakra-ui/core";
import Chakra from "../components/Chakra";

const ExternalLink = ({ children, href, ...rest }) => (
  <Link {...rest} href={href} color="cyan.700" isExternal>
    {children}
  </Link>
);

const Heading1 = ({ children, ...rest }) => (
  <Text
    {...rest}
    fontSize={["4xl", "4xl", "5xl", "5xl"]}
    color="gray.700"
    textAlign="center"
    mx="auto"
    as="h1"
  >
    {children}
  </Text>
);

const Heading2 = ({ children, ...rest }) => (
  <Text
    {...rest}
    fontSize={["2xl", "2xl", "3xl", "3xl"]}
    color="gray.600"
    as="h2"
  >
    {children}
  </Text>
);

const Paragraph = ({ children, ...rest }) => (
  <Text {...rest} as="p">
    {children}
  </Text>
);

const UnorderedList = ({ children, ...rest }) => (
  <Stack {...rest} spacing={2} as="ul">
    {children}
  </Stack>
);

UnorderedList.Item = ({ children, ...rest }) => (
  <Text {...rest} marginLeft="32px" as="li">
    {children}
  </Text>
);

export default function Index() {
  return (
    <Chakra>
      <Chakra.Layout>
        <Stack marginTop={[5, 5, 6, 8]}>
          <Heading1>Mocking GraphQL in Cypress</Heading1>
          <Paragraph>
            This is a detailed guide to mocking a graphQL API for{" "}
            <ExternalLink href="https://www.cypress.io/">
              Cypress testing
            </ExternalLink>
            . Our approach is by no means the only way to mock graphQL, but it
            has been highly successful in our team, and I am keen to share how
            we achieved it.
          </Paragraph>
          <Paragraph>
            The intent for this guide is to be a comprehensive set of
            instructions for how to get a mock graphQL API up and going in your
            Cypress tests - if any instructions are lacking, incorrect, or don't
            work in your use case, please let me know. I'm open to feedback, and
            if you have a completely different way to do what we're doing, I'd
            love to hear it.
          </Paragraph>
          <Heading2>Overview</Heading2>
          <Paragraph>
            First we'll create a schema which we can run queries against, but
            with mock resolvers. This step will largely follow the{" "}
            <ExternalLink href="https://www.apollographql.com/docs/graphql-tools/mocking/">
              Apollo GraphQL guide
            </ExternalLink>{" "}
            (via graphql-tools) to mocking.
          </Paragraph>
          <Paragraph>
            Then we stub window fetch, using{" "}
            <ExternalLink href="https://docs.cypress.io/api/commands/stub.html">
              Cypress stub functionality
            </ExternalLink>
            , specifically for graphQL requests, and resolve against our mocked
            schema.
          </Paragraph>
          <Paragraph>
            Inspired by{" "}
            <ExternalLink href="https://www.freecodecamp.org/news/a-new-approach-to-mocking-graphql-data-1ef49de3d491/">
              this guide from Stripe
            </ExternalLink>
            , we'll use their methods to unlock the ability to create custom
            mocks each time we need. The guide also heavily influenced mock
            providers we wrote for; development tools, unit testing and
            storybook stories.
          </Paragraph>
          <Heading2>Dependencies</Heading2>
          <Paragraph>The solution depends on these packages:</Paragraph>
          <UnorderedList>
            <UnorderedList.Item>
              <ExternalLink href="https://graphql.org/graphql-js/">
                graphql
              </ExternalLink>{" "}
              - to resolve queries against your mocked schema
            </UnorderedList.Item>
            <UnorderedList.Item>
              <ExternalLink href="https://www.apollographql.com/docs/graphql-tools/">
                graphql-tools
              </ExternalLink>{" "}
              - to make your schema 'executable' and add mock functions
            </UnorderedList.Item>
          </UnorderedList>
          <Paragraph>
            If you don't already depend on these packages, you can add them as
            dev dependencies, using your project's package manager. In addition
            to these packages, there's some code to write and maintain within
            your project, which will be outlined in the article. Feel free to
            copy, update and change as you need.
          </Paragraph>
          <Heading2>Copy your schema definition</Heading2>
          <Paragraph>
            Let's get started! The first thing to do is to get a copy of your
            schema. Fortunately for us, our development graphQL server supports
            the "
            <ExternalLink href="https://github.com/prisma-labs/graphql-playground/">
              playground
            </ExternalLink>{" "}
            ". We can access the entire schema at:
          </Paragraph>
          <Text textAlign="center" marginX="auto" marginY={2}>
            <code>{`https://{API_SERVICE_DOMAIN}/playground`}</code>
          </Text>
        </Stack>
      </Chakra.Layout>
    </Chakra>
  );
}
