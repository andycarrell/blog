import { CSSReset, ThemeProvider, theme, Box } from "@chakra-ui/core";

const Layout = ({ children }) => (
  <Box
    maxWidth={["100%", "100%", "560px", "720px"]}
    marginX="auto"
    paddingX={2}
  >
    {children}
  </Box>
);

const Chakra = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    {children}
  </ThemeProvider>
);

Chakra.Layout = Layout;

export default Chakra;
