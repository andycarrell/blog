import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Stack, Link, useClipboard, IconButton } from "@chakra-ui/core";
import { Twitter } from "components/icons";
import { Overline } from "components/typography";

function useMerge([state, setState]) {
  const mergeState = useCallback((s) => setState((p) => ({ ...p, ...s })), [
    setState,
  ]);

  return [state, mergeState];
}

function useShare() {
  // This should come from an environment variable
  const base = "https://blog.andycarrell.now.sh";
  const { asPath } = useRouter();

  const [share, mergeState] = useMerge(
    useState({
      url: `${base}${asPath}`,
      via: "andy__carrell",
      text: encodeURIComponent("Check out this post 👉"),
    })
  );

  useEffect(() => {
    mergeState({
      text: encodeURIComponent(document.title),
    });
  }, [mergeState]);

  return share;
}

const Copy = ({ url }) => {
  const { onCopy, hasCopied } = useClipboard(url);
  const label = "Copy url";

  return (
    <IconButton
      size="md"
      borderRadius="100%"
      onClick={onCopy}
      aria-label={label}
      title={label}
      variant="solid"
      icon={hasCopied ? "check" : "link"}
      variantColor="blue"
    />
  );
};

const Tweet = ({ url, text, via }) => (
  <IconButton
    href={`https://twitter.com/intent/tweet?text=${text}&url=${url}&via=${via}`}
    as={Link}
    isExternal
    size="md"
    borderRadius="100%"
    aria-label="Share via twitter"
    variant="solid"
    icon={Twitter}
    variantColor="blue"
  />
);

export default function Share(props) {
  const { url, text, via } = useShare();

  return (
    <Stack align="center" justify="start" {...props}>
      <Overline>Share</Overline>
      <Box>
        <Copy url={url} />
      </Box>
      <Box>
        <Tweet url={url} text={text} via={via} />
      </Box>
    </Stack>
  );
}
