import {
  Box,
  IconButton,
  Text,
  Stack,
  Link,
  useClipboard,
} from "@chakra-ui/core";
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

const Code = ({ children, ...rest }) => {
  const { onCopy, hasCopied } = useClipboard(children);

  return (
    <Text
      {...rest}
      backgroundColor="gray.50"
      whiteSpace="pre"
      fontSize="sm"
      lineHeight="tall"
      borderRadius="md"
      position="relative"
      padding={4}
    >
      <code>{children}</code>
      <Box position="absolute" bottom="12px" right="12px">
        <IconButton
          size="sm"
          onClick={onCopy}
          aria-label={hasCopied ? "Copied" : "Copy"}
          title={hasCopied ? "Copied" : "Copy"}
          icon={hasCopied ? "check" : "copy"}
        />
      </Box>
    </Text>
  );
};

Code.Inline = ({ children }) => (
  <Text
    as="span"
    borderRadius="sm"
    backgroundColor="gray.50"
    fontSize="sm"
    lineHeight="tall"
    padding={1}
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
        <Stack>
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
          <Box textAlign="center" marginX="auto" padding={2}>
            <Code.Inline>{`https://{API_SERVICE_DOMAIN}/playground`}</Code.Inline>
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
  // Schema definition: 'scalar DateTime'
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
            This is immediately a big win    —   any Query or Mutation we
            resolve against this schema will return with some result. We could
            drop in this executable schema and have a mock straightaway. The
            mock wouldn't be particularly reliable or consistent, so isn't a
            great fit for testing yet.
          </Paragraph>
          <Paragraph>
            Conversely, the entire schema being mocked is extremely helpful for
            long term test maintenance  —  the suite has a built in resilience
            to (smaller) schema changes. Once the mocking utility is put
            together, and we've written tests that accurately define what they
            depend on, we have high confidence that tests only fail when the
            underlying code has changed.
          </Paragraph>
          <Heading2>Stub window fetch</Heading2>
          <Paragraph>
            Disclaimer: we're using Apollo, which depends on{" "}
            <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">
              fetch
            </ExternalLink>
            . Other clients may use XHR, or you might be{" "}
            <ExternalLink href="https://developer.mozilla.org/en-US/docs/Glossary/Polyfill">
              polyfilling
            </ExternalLink>{" "}
            fetch. Depending on your exact use case, the following method might
            not work directly copied from here. Investigate exactly how your app
            interacts with the API  —  that's where you want to mock.
          </Paragraph>
          <Paragraph>
            We'll stub the fetch function, using{" "}
            <Code.Inline>cy.stub(...)</Code.Inline>, to replace the
            functionality by resolving the query against our mock schema. Then
            we'll create a{" "}
            <ExternalLink href="https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax">
              custom Cypress command
            </ExternalLink>
            , because there's work in replacing the built in fetch function that
            would be tedious to do in every test. We want to have a different
            mock in each test, so that we can define the shape of the mock we
            need. This also allows us to only define the data we need, and
            encourages keeping tests independent. If you're not familiar with
            writing custom Cypress commands, check out the{" "}
            <ExternalLink href="https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax">
              official documentation
            </ExternalLink>
            .
          </Paragraph>
          <Paragraph>The end usage of the custom command looks like:</Paragraph>
          <Code>
            {`describe("Test - Accounts", () => {
  it("should show an error when searching accounts", () => {
    cy.mockGraphQLApi({
      // Every instance of type Account will return:
      Account: () => ({
        email: "mocked@gmail.com",
        firstName: "Katherine",
        lastName: "French",
      }),
      // We can make queries fail by throwing an error
      Query: () => ({
        searchAccounts: () => {
          throw new Error("InternalServerError");
        },
      }),
    });

    cy.visit("/accounts");

    // Expect error state ...
  });
});`}
          </Code>
          <Paragraph>
            As an aside   —   I generally prefer repetition in tests because the
            consequence of over abstraction is much higher than application
            code. Even so, we've still written a number of custom Cypress
            commands extracting commands or sequences of commands where they are
            used frequently, relatively complicated, or where the commands don't
            concisely represent the intention of a test. We mock graphQL in
            (almost) every test in this particular suite, so I think it's a
            really good candidate for a custom command.
          </Paragraph>
          <Paragraph>
            Back to stubbing <Code.Inline>window.fetch   </Code.Inline> —    the
            Apollo documentation has{" "}
            <ExternalLink href="https://www.apollographql.com/docs/graphql-tools/mocking/">
              an example resolving a query against the schema
            </ExternalLink>
            :
          </Paragraph>
          <Code>
            {`import { graphql } from "graphql";

// Make a GraphQL schema with no resolvers
// ...

graphql(schema, query).then((result) => {
  console.log('Got result', result);
});`}
          </Code>
          <Paragraph>
            We can use this function in place of where we would otherwise call
            our API:
          </Paragraph>
          <Code>
            {`import { graphql } from "graphql";

// Make a GraphQL schema with no resolvers
const resolve = result => ({
  json: () => Promise.resolve(result),
  text: () => Promise.resolve(JSON.stringify(result)),
  ok: true,
});

Cypress.Commands.add("mockGraphQLApi", { prevSubject: false },
  () => {
    // Changes the window object before load
    // Call cy.mockGraphQLApi(...) before visiting the page
    cy.on("window:before:load", win => {
      function fetch(_, { body }) {
        const { query } = JSON.parse(body);
        return graphql(schema, query).then(resolve);
      }

      cy.stub(win, "fetch").callsFake(fetch);
    });
  }
);`}
          </Code>
          <Paragraph>
            This may work as is, but for us there were other parts of the app
            that required fetch to access the rest of the internet. The solution
            was to preserve the original implementation, and only call the
            stubbed version when the URL matches our API URL:
          </Paragraph>
          <Code>
            {`import { graphql } from "graphql";

// Make a GraphQL schema with no resolvers

// const resolve = ...

function fetchMock(_, { body }) {
  const { query } = JSON.parse(body);
  return graphql(schema, query).then(resolve);
}

Cypress.Commands.add("mockGraphQLApi", { prevSubject: false },
  () => {
    // Your API's url - we use Cypress environment variables
    const queryUrl =
      \`https://\${Cypress.env("API_SERVICE_DOMAIN")}/query\`;

    cy.on("window:before:load", win => {
      // To debug here: const log = win.console.log
      const originalFetch = win.fetch;
      function fetch(url, ...rest) {
        if (url === queryUrl) {
          return fetchMock(url, ...rest);
        }
        return originalFetch(url, ...rest);
      }
      cy.stub(win, "fetch").callsFake(fetch);
    });
  }
);`}
          </Code>
          <Heading2>Changing mocks between tests</Heading2>
          <Paragraph>
            The mock we've made has a couple of limitations: any queries or
            mutations that pass variables will fail and our mock resolvers are
            "static", (defined once, hard-coded when we made the executable
            schema). This is less than ideal because we would have to use the
            same mock definition for every test.
          </Paragraph>
          <Paragraph>
            Passing variables applies to almost every mutation, so we'll fairly
            quickly run into this issue. These queries will fail because{" "}
            <Text as="i">
              we haven't yet passed the variables to the{" "}
              <Code.Inline>graphql</Code.Inline> function to resolve against the
              schema
            </Text>
            . The variables are passed as part of the "body" to fetch and need
            to be passed as the 5th argument to{" "}
            <Code.Inline>graphql</Code.Inline>.
          </Paragraph>
          <Code>
            {`// const resolve = ...

const fetchMock = (_, { body }) => {
  const { query, variables } = JSON.parse(body);
  return graphql(schema, query, {}, {}, variables).then(resolve);
};

// Cypress.Commands.add("mockGraphQLApi", ...)`}
          </Code>
          <Paragraph>
            The next step is to merge default resolvers (which we've already
            defined) with specific resolvers, providing flexibility each time we
            mock the API.
          </Paragraph>
          <Paragraph>
            It's worth noting at this point that the following functionality has
            been recognised as valuable, and potentially should be included in
            grapql-tools.{" "}
            <ExternalLink href="https://github.com/Urigo/graphql-tools/pull/1084">
              At the time of writing there's an open pull request
            </ExternalLink>
            . It's worth checking if this has been merged and the functionality
            added within the package.
          </Paragraph>
          <Paragraph>
            We initially defined our mocks where we made the schema executable:
          </Paragraph>
          <Code>
            {`// Completely static
const mocks = {
  // ...
};

addMockFunctionsToSchema({ schema, mocks });`}
          </Code>
          <Paragraph>
            Defining the mocks once is a big limitation    —   we really want to
            be able to change the mock per test, so that we can tailor the
            conditions we're testing under. This is initially fairly simple    —
              generate the schema dynamically each time we call the custom
            Cypress command:
          </Paragraph>
          <Code>
            {`import schemaString from './schemaDefinition';
function makeMockedSchema({ mocks }) {
  const schema = makeExecutableSchema({ typeDefs: schemaString });
  addMockFunctionsToSchema({ schema, mocks });
  return schema;
}

Cypress.Commands.add("mockGraphQLApi", { prevSubject: false },
  (mocks = {}) => {
    const schema = makeMockedSchema({ mocks });
    const queryUrl =
      \`https://\${Cypress.env("API_SERVICE_DOMAIN")}/query\`;

    function fetchMock(_, { body }) {
      const { query, variables } = JSON.parse(body);
      return graphql(
        schema, query, {}, {}, variables,
      ).then(resolve);
    }

    // cy.on("window:before:load", ...)
  }
);`}
          </Code>
          <Paragraph>
            This does allow us to define a different mock per test, but in every
            test we would have to also set any defaults that our schema
            required     —  for example setting a resolver for{" "}
            <Code.Inline>DateTime</Code.Inline>:
          </Paragraph>
          <Code>
            {`cy.mockGraphQLApi({
  DateTime: () => new Date().toISOString(),
  // ... specific content we want to mock for this test
});`}
          </Code>
          <Paragraph>
            Whilst merging objects in JS using the spread operator (or even
            <Code.Inline>Object.assign</Code.Inline>) is fairly common, it won't
            be sufficient in this case. Most graphQL schemas will require deeply
            nesting objects, and the nested values of those objects may be
            functions (resolvers) too:
          </Paragraph>
          <Code>
            {`cy.mockGraphQLApi({
  DateTime: () => new Date().toISOString(),
  Account: () => ({
    email: "mocked@gmail.com",
    address: () => ({
      city: "Auckland",
      country: "New Zealand",
    }),
  }),
});`}
          </Code>
          <Paragraph>
            Both these caveats mean simple object merging will not be
            sufficient. Fortunately the{" "}
            <ExternalLink href="https://www.freecodecamp.org/news/a-new-approach-to-mocking-graphql-data-1ef49de3d491/">
              Stripe guide
            </ExternalLink>{" "}
            (which we followed right at the start of this guide) links to a
            function which can be used to merge default mocks with test specific
            definitions.
          </Paragraph>
          <Code>
            {`function mergeResolvers(target, input) {
  const inputTypenames = Object.keys(input);

  return inputTypenames.reduce(
    (accum, key) => {
      const inputResolver = input[key];
      if (key in target) {
        const targetResolver = target[key];
        const resolvedInput = inputResolver();
        const resolvedTarget = targetResolver();

        if (
          !!resolvedTarget &&
          !!resolvedInput &&
          typeof resolvedTarget === "object" &&
          typeof resolvedInput === "object" &&
          !Array.isArray(resolvedTarget) &&
          !Array.isArray(resolvedInput)
        ) {
          const newValue = { ...resolvedTarget, ...resolvedInput };
          return { ...accum, [key]: () => newValue };
        }
      }
      return { ...accum, [key]: inputResolver };
    },
    { ...target }
  );
}`}
          </Code>
          <Paragraph>
            The original code for the merge resolvers function is{" "}
            <ExternalLink href="https://gist.github.com/hellendag/2aa9ad1f9b771f38802760c269bb1b76">
              in a Github gist
            </ExternalLink>
            , it's not long and can easily be copied into your project. We
            "maintain" a copy, although we haven't had to change it as yet.
          </Paragraph>
          <Paragraph>
            We can then separate out our "default" mocks, (which we want to
            apply every time we mock the API), and mock definitions per test,
            then merge them in when we add mock functions to the schema:
          </Paragraph>
          <Code>
            {`const defaultMocks = {
  DateTime: () => new Date(new Date()).toISOString(),
  Fraction: () => ({ numerator: 10, denominator: 45 }),
};

function makeMockedSchema({ mocks }) {
  const schema = makeExecutableSchema({ typeDefs: schemaString });
  const mergedMocks = mergeResolvers(defaultMocks, mocks);
  addMockFunctionsToSchema({ schema, mocks: mergedMocks });
  return schema;
}

// Cypress.Commands.add("mockGraphQLApi", ...)`}
          </Code>
          <Heading2>Mutations</Heading2>
          <Paragraph>
            So far we've exclusively looked at mock resolvers for entire types
            on the schema, which does get us most of the way there. In the case
            of a mutation  — or a query that isn't a one to one mapping to a
            type  —  we need to mock resolvers for the Mutation / Query types
            respectively:
          </Paragraph>
          <Code>
            {`cy.mockGraphQLApi({
  Account: () => ({
    email: "mocked@gmail.com",
    address: () => ({
      city: "Auckland",
      country: "New Zealand",
    }),
  }),
  Query: () => ({
    searchAccounts: () => [{
      email: "faked@gmail.com",
      address: () => ({
        city: "Wellington",
        country: "New Zealand",
      }),
    }],
  }),
  Mutation: () => ({
    updateAccount: () => ({
      address: () => ({
        city: "Sydney",
        country: "Australia",
      }),
    }),
  }),
});`}
          </Code>
          <Paragraph>
            Take note of the capitalisation  —  in our case types (Account,
            Query, Mutation), are{" "}
            <ExternalLink href="https://techterms.com/definition/pascalcase">
              Pascal case
            </ExternalLink>{" "}
            (upper camel case), and properties on types are{" "}
            <ExternalLink href="https://techterms.com/definition/camelcase">
              camel case
            </ExternalLink>
            . Although this matches our schema convention, forgetting to switch
            between the two can still be a bit of a trap.
          </Paragraph>
          <Paragraph>
            We can also access the variables passed to a mutation or query from
            the second argument to our mock resolver. This is extremely useful
            for creating responsive mocks (which change based on what they're
            called with) and for asserting that the mock is called with the
            correct arguments.
          </Paragraph>
          <Code>
            {`// For mutation definition:
// \`mutation { updateAccount(email: "\${email}") { email } }\`

cy.mockGraphQLApi({
  Mutation: () => ({
    updateAccount: (_, { email }) => {
      console.log(email);
      // ...
    },
  });
});`}
          </Code>
          <Heading2>Piecing it all together</Heading2>
          <Paragraph>
            Alongside our schema definition, we extract{" "}
            <Code.Inline>makeMockedSchema</Code.Inline> into its own file. This
            enables us to reuse the mock in both Cypress and unit tests. FFor
            our unit tests we followed{" "}
            <ExternalLink href="https://www.freecodecamp.org/news/a-new-approach-to-mocking-graphql-data-1ef49de3d491/">
              the rest of the Stripe guide
            </ExternalLink>
            .
          </Paragraph>
          <Code>
            {`import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from "graphql-tools";
// This is the schema string
import schemaDefinition from "./schemaDefinition";

function mergeResolvers(target, input) {
  const inputTypenames = Object.keys(input);

  return inputTypenames.reduce(
    (accum, key) => {
      const inputResolver = input[key];
      if (key in target) {
        const targetResolver = target[key];
        const resolvedInput = inputResolver();
        const resolvedTarget = targetResolver();

        if (
          !!resolvedTarget &&
          !!resolvedInput &&
          typeof resolvedTarget === "object" &&
          typeof resolvedInput === "object" &&
          !Array.isArray(resolvedTarget) &&
          !Array.isArray(resolvedInput)
        ) {
          const newValue = { ...resolvedTarget, ...resolvedInput };
          return { ...accum, [key]: () => newValue };
        }
      }
      return { ...accum, [key]: inputResolver };
    },
    { ...target }
  );
}

const defaultMocks = {
  DateTime: () => new Date(new Date()).toISOString(),
  Fraction: () => ({ numerator: 10, denominator: 45 }),
};

export default function makeMockedSchema({ mocks }) {
  const mergedMocks = mergeResolvers(defaultMocks, mocks);
  const schema = makeExecutableSchema({
    typeDefs: schemaDefinition,
  });
  addMockFunctionsToSchema({ schema, mocks: mergedMocks });

  return schema;
}`}
          </Code>
          <Paragraph>
            We then use <Code.Inline>makeMockedSchema</Code.Inline> in a custom
            Cypress command:
          </Paragraph>
          <Code>
            {`import { graphql } from "graphql";
import makeMockedSchema from "./makeMockedSchema";

const resolve = result => ({
  json: () => Promise.resolve(result),
  text: () => Promise.resolve(JSON.stringify(result)),
  ok: true,
});

Cypress.Commands.add("mockGraphQLApi", { prevSubject: false },
  (mocks = {}) => {
    const queryUrl =
      \`https://\${Cypress.env("API_SERVICE_DOMAIN")}/query\`;
    const schema = makeMockedSchema({ mocks });
    const fetchMock = (_, { body }) => {
      const { query, variables } = JSON.parse(body);
      return graphql(schema, query, {}, {}, variables)
        .then(resolve);
    };

    cy.on("window:before:load", win => {
      const originalFetch = win.fetch;
      function fetch(url, ...rest) {
        if (url === queryUrl) {
          return fetchMock(url, ...rest);
        }
        return originalFetch(url, ...rest);
      }
      cy.stub(win, "fetch").callsFake(fetch);
    });
  },
);`}
          </Code>
          <Paragraph>
            And that's it! I've seen some other implementations and attempts at
            sharing this functionality as a testing tool/library, but I've found
            that owning this code gives us the flexibility to extend and change
            it as we need. The maintenance overhead compared to the value this
            adds has been an extremely good trade off for our team.
          </Paragraph>
          <Heading2>Conclusion</Heading2>
          <Paragraph>
            Using this simple mocking utility has enabled us to write a large
            number of high fidelity tests that run completely independently of
            our backend servers. In turn, this encourages good test coverage of
            frontend features  —  not only has this been a development
            productivity boost, but has caught countless bugs before they even
            make their way to master.
          </Paragraph>
          <Paragraph>
            In this guide, we've taken a look at how to mock a graphQL API in a
            deterministic and reusable way. At a high level, we followed these
            steps:
          </Paragraph>
          <UnorderedList>
            <UnorderedList.Item>Copy schema definition</UnorderedList.Item>
            <UnorderedList.Item>
              Make an executable schema, merge default and custom resolvers
            </UnorderedList.Item>
            <UnorderedList.Item>
              Stub fetch and resolve queries against the executable schema
            </UnorderedList.Item>
          </UnorderedList>
          <Paragraph>
            My intent is to share this method, so other teams can realise the
            same benefits we have. At each step I've explained what we did and
            why, but I appreciate information might be lacking  —  if so{" "}
            <ExternalLink href="https://twitter.com/andy__carrell">
              please reach out
            </ExternalLink>{" "}
            and I can attempt to clarify.
          </Paragraph>
        </Stack>
      </Page>
    </Chakra>
  );
}
