import { Box, Text, Flex, Icon } from "@chakra-ui/core";

import Chakra from "./Chakra";

const Layout = ({ children }) => (
  <Box
    maxWidth={["100%", "100%", "560px", "720px"]}
    marginX="auto"
    paddingX={[2, 2, 0, 0]}
    paddingTop={[4, 4, 6, 6]}
    paddingBottom={[24, 24, 32, 32]}
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
      wrap="wrap"
      align="center"
      width="100%"
      height="100%"
      paddingX={[3, 3, 5, 5]}
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
  return (
    <Chakra>
      <Header />
      <Layout>{children}</Layout>
    </Chakra>
  );
}
