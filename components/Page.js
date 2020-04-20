import { Box, Text, Flex, Icon } from "@chakra-ui/core";
import { Fragment, useEffect } from "react";

function useBodyOverflowHidden() {
  useEffect(() => {
    document.body.style = "overflow-x: hidden;";
  }, []);
}

const Layout = ({ children }) => (
  <Box
    maxWidth={["100%", "100%", "560px", "720px"]}
    marginX="auto"
    paddingX={2}
  >
    {children}
  </Box>
);

const Header = () => (
  <Box
    as="header"
    width="100%"
    height={["60px", "60px", "80px", "80px"]}
    backgroundColor="teal.400"
    position="sticky"
    zIndex={1000}
    top={0}
  >
    <Flex
      direction="row"
      align="center"
      width="100%"
      height="100%"
      marginX={[3, 3, 5, 5]}
    >
      <Text
        color="gray.50"
        fontWeight="bold"
        fontSize={["lg", "lg", "2xl", "2xl"]}
      >
        andycarrell
        <Icon name="chevron-right" marginX={1} marginBottom={1} />
      </Text>
      <Text color="white" fontSize={["xl", "xl", "2xl", "2xl"]}>
        Blog
      </Text>
    </Flex>
  </Box>
);

export default function Page({ children }) {
  useBodyOverflowHidden();
  return (
    <Fragment>
      <Header />
      <Layout>{children}</Layout>
    </Fragment>
  );
}
