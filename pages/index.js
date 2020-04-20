import { Box, Text, Stack, Link } from "@chakra-ui/core";
import Chakra from "../components/Chakra";
import Page from "../components/Page";
import useTitle from "../hooks/useTitle";

const ExternalLink = ({ children, href, ...rest }) => (
  <Link {...rest} href={href} color="cyan.700" isExternal>
    {children}
  </Link>
);

const Heading1 = ({ children, ...rest }) => (
  <Text
    {...rest}
    textAlign="center"
    mx="auto"
    fontWeight="medium"
    fontFamily="heading"
    fontSize={["4xl", "4xl", "5xl", "5xl"]}
    color="gray.700"
    as="h1"
  >
    {children}
  </Text>
);

const Heading2 = ({ children, ...rest }) => (
  <Text
    {...rest}
    fontWeight="medium"
    fontFamily="heading"
    fontSize={["2xl", "2xl", "3xl", "3xl"]}
    color="gray.600"
    as="h2"
  >
    {children}
  </Text>
);

const Paragraph = ({ children, ...rest }) => (
  <Text {...rest} as="p" lineHeight="tall">
    {children}
  </Text>
);

const UnorderedList = ({ children, ...rest }) => (
  <Stack {...rest} spacing={2} as="ul" lineHeight="tall">
    {children}
  </Stack>
);

UnorderedList.Item = ({ children, ...rest }) => (
  <Text {...rest} marginLeft="32px" as="li">
    {children}
  </Text>
);

const Code = ({ children, ...rest }) => (
  <Text
    {...rest}
    backgroundColor="gray.50"
    whiteSpace="pre"
    borderRadius="md"
    padding={4}
  >
    <code>{children}</code>
  </Text>
);

const Quote = ({ children, ...rest }) => (
  <Text {...rest} fontSize="lg" as="em" color="gray.600">
    {children}
  </Text>
);

export default function Index() {
  useTitle("andycarrell > Blog");

  return (
    <Chakra>
      <Page>
        <Stack paddingY={6}>
          <Box marginY={[5, 5, 6, 8]}>
            <Heading1>Mocking GraphQL in Cypress</Heading1>
          </Box>
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
            Cypress tests  — if any instructions are lacking, incorrect, or
            don't work in your use case, please let me know. I'm open to
            feedback, and if you have a completely different way to do what
            we're doing, I'd love to hear it.
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
          <Box textAlign="center" marginX="auto">
            <Code>{`https://{API_SERVICE_DOMAIN}/playground`}</Code>
          </Box>
          <Paragraph>
            Copy the definition into a file that can be imported as a plain
            string. We chose a plain JS file using string literals, because the
            JS definition looks as close to the copied output as possible.
          </Paragraph>
          <Code>
            {`export default \`
  type Account {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
  }
\``}
          </Code>
          <Paragraph>
            We depend on a static definition of our schema for graphQL mocks.
            This means every time the schema changes, we have to copy the new
            definition into our project. So far we haven't found this to be a
            huge cost, since a changing schema often means queries or mutations
            require a change too. There are methods of fetching the schema
            dynamically  — which could be leveraged at run or build time  — this
            is on our backlog, but maintaining a static copy hasn't had a high
            enough cost to make it a high priority.
          </Paragraph>
          <Heading2>Make an executable schema and add mocks</Heading2>
          <Paragraph>
            Now we have a schema definition, we make an "executable" schema
            which allows us to resolve queries against it. This section of the
            guide is taken directly from the{" "}
            <ExternalLink href="https://www.apollographql.com/docs/graphql-tools/mocking/">
              graphql-tools documentation
            </ExternalLink>
            .
          </Paragraph>
          <Code>
            {`import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';

import schemaString from './schemaDefinition';
// Make a GraphQL schema with no resolvers
const schema = makeExecutableSchema({ typeDefs: schemaString });
// Add mocks, modifies schema in place
addMockFunctionsToSchema({ schema });`}
          </Code>
          <Paragraph>
            We will define specific mock resolvers later, but for now the
            minimum requirement is to set defaults for any custom scalars you
            may have defined in your schema. For example, we have defined a
            scalar for DateTime. We expect it to be an{" "}
            <ExternalLink href="https://en.wikipedia.org/wiki/ISO_8601">
              ISOString
            </ExternalLink>
              — so we define a 'resolver', which returns a mock value:
          </Paragraph>
          <Code>
            {`// Add mocks, modifies schema in place
const mocks = {
  // Schema definition: \`scalar DateTime\`
  // Also note the type - function that returns a primitive
  DateTime: () => new Date().toISOString(),
}

addMockFunctionsToSchema({ schema, mocks });`}
          </Code>
          <Paragraph>
            To explain what these initial steps achieve (
            <ExternalLink href="https://www.apollographql.com/docs/graphql-tools/mocking/#default-mock-example">
              from the graphql-tools docs
            </ExternalLink>
            ):
          </Paragraph>
          <Quote>
            This mocking logic simply looks at your schema and makes sure to
            return a string where your schema has a string, a number for a
            number, etc. So you can already get the right shape of result.
          </Quote>
          <Paragraph>
            This is immediately a big win - any Query or Mutation we resolve
            against this schema will return with some result. We could drop in
            this executable schema and have a mock straightaway. The mock
            wouldn't be particularly reliable or consistent, so isn't a great
            fit for testing yet.
          </Paragraph>
          <Paragraph>
            Conversely, the entire schema being mocked is extremely helpful for
            long term test maintenance  —  the suite has a built in resilience
            to (smaller) schema changes. Once the mocking utility is put
            together, and we've written tests that accurately define what they
            depend on, we have high confidence that tests only fail when the
            underlying code has changed.
          </Paragraph>
        </Stack>
      </Page>
    </Chakra>
  );
}
