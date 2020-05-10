import {
  Box,
  Code,
  IconButton,
  Text,
  Stack,
  Link,
  useClipboard,
} from "@chakra-ui/core";

import CodeHighlighter from "./CodeHighlighter";

export const ExternalLink = ({ children, href, ...rest }) => (
  <Link {...rest} href={href} color="cyan.800" isExternal>
    {children}
  </Link>
);

export const Heading1 = ({ children, ...rest }) => (
  <Text
    marginTop={[2, 2, 3, 3]}
    {...rest}
    textAlign="center"
    mx="auto"
    fontFamily="heading"
    fontWeight="semibold"
    fontSize={["4xl", "4xl", "5xl", "5xl"]}
    color="gray.600"
    as="h1"
  >
    {children}
  </Text>
);

export const Heading2 = ({ children, ...rest }) => (
  <Text
    marginTop={[2, 2, 3, 3]}
    {...rest}
    fontFamily="heading"
    fontWeight="medium"
    fontSize={["2xl", "2xl", "3xl", "3xl"]}
    color="gray.500"
    as="h2"
  >
    {children}
  </Text>
);

export const Paragraph = ({ children, ...rest }) => (
  <Text {...rest} as="p" lineHeight="tall" fontSize="lg">
    {children}
  </Text>
);

export const UnorderedList = ({ children, ...rest }) => (
  <Stack {...rest} spacing={2} as="ul" lineHeight="tall">
    {children}
  </Stack>
);

UnorderedList.Item = ({ children, ...rest }) => (
  <Text {...rest} marginLeft={[5, 5, 8, 8]} as="li">
    {children}
  </Text>
);

export const Quote = ({ children, ...rest }) => (
  <Text
    {...rest}
    paddingY={3}
    paddingLeft={3}
    fontSize="lg"
    as="em"
    color="gray.600"
  >
    {children}
  </Text>
);

export const CodeBlock = ({ children, ...rest }) => {
  const { onCopy, hasCopied } = useClipboard(children);
  const buttonLabel = hasCopied ? "Copied" : "Copy";

  return (
    <Box
      {...rest}
      backgroundColor="gray.50"
      position="relative"
      borderRadius="md"
      padding={4}
    >
      <Text
        as="div"
        whiteSpace="pre"
        fontSize="sm"
        lineHeight="tall"
        overflowX="scroll"
      >
        <code>
          <CodeHighlighter>{children}</CodeHighlighter>
        </code>
      </Text>
      <Box as="span" position="absolute" bottom="12px" right="12px">
        <IconButton
          size="sm"
          onClick={onCopy}
          aria-label={buttonLabel}
          title={buttonLabel}
          icon={hasCopied ? "check" : "copy"}
        />
      </Box>
    </Box>
  );
};

export const CodeInline = ({ children }) => (
  <Code
    backgroundColor="gray.50"
    fontSize="sm"
    lineHeight="tall"
    wordBreak="break-all"
    padding="2px"
  >
    {children}
  </Code>
);
