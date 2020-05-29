import NextLink from "next/link";
import {
  Box,
  Code,
  IconButton,
  Text,
  Stack,
  Link,
  useClipboard,
} from "@chakra-ui/core";
import styled from "@emotion/styled";

import CodeHighlighter from "./CodeHighlighter";

const StyledLink = styled(Link)`
  transition: box-shadow 250ms ease-in-out;
  padding-bottom: 1px;
  box-shadow: none;
  &:focus {
    color: ${(props) => props.theme.colors.teal[500]};
    box-shadow: 0 1px 0 0 currentColor;
  }
  &:hover {
    text-decoration-line: none;
    text-decoration-style: initial;
    text-decoration-color: initial;
    color: ${(props) => props.theme.colors.cyan[900]};
    box-shadow: 0 1px 0 0 currentColor;
  }
`;

export const Dash = () => (
  <Box as="span" px="2px">
    — 
  </Box>
);

export const ExternalLink = ({ children, href, ...rest }) => (
  <StyledLink {...rest} href={href} color="cyan.800" isExternal>
    {children}
  </StyledLink>
);

export const InternalLink = ({ children, href, as, ...rest }) => (
  <NextLink href={href} as={as} passHref>
    <StyledLink {...rest} color="cyan.800" isExternal={false}>
      {children}
    </StyledLink>
  </NextLink>
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

export const Overline = ({ children, ...rest }) => (
  <Text
    {...rest}
    fontFamily="heading"
    fontWeight="bold"
    fontSize="xs"
    color="gray.500"
    textTransform="uppercase"
    as="h5"
  >
    {children}
  </Text>
);

export const Paragraph = ({ children, ...rest }) => (
  <Text {...rest} as="p" lineHeight={1.8} fontSize="lg">
    {children}
  </Text>
);

export const Callout = ({ children, ...rest }) => (
  <Box
    {...rest}
    p={3}
    mx={[2, 2, 5, 5]}
    backgroundColor="gray.200"
    borderRadius="md"
  >
    <Text as="div" lineHeight={1.8} fontSize={["md", "md", "lg", "lg"]}>
      {children}
    </Text>
  </Box>
);

export const UnorderedList = ({ children, ...rest }) => (
  <Stack {...rest} spacing={2} as="ul" fontSize="lg" lineHeight={1.8}>
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
