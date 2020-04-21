import React from "react";

import {
  Box,
  IconButton,
  Text,
  Stack,
  Link,
  useClipboard,
} from "@chakra-ui/core";

export const ExternalLink = ({ children, href, ...rest }) => (
  <Link {...rest} href={href} color="cyan.700" isExternal>
    {children}
  </Link>
);

export const Heading1 = ({ children, ...rest }) => (
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

export const Heading2 = ({ children, ...rest }) => (
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

export const Paragraph = ({ children, ...rest }) => (
  <Text {...rest} as="p" lineHeight="tall">
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

export const Code = ({ children, ...rest }) => {
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
      <Text whiteSpace="pre" fontSize="sm" lineHeight="tall" overflowX="scroll">
        <code>{children}</code>
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

Code.Inline = ({ children }) => (
  <Text
    as="span"
    borderRadius="sm"
    backgroundColor="gray.50"
    fontSize="sm"
    lineHeight="tall"
    wordBreak="break-all"
    padding={1}
  >
    <code>{children}</code>
  </Text>
);
