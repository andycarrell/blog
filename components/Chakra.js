import { CSSReset, ThemeProvider, theme } from "@chakra-ui/core";

const Chakra = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    {children}
  </ThemeProvider>
);

export default Chakra;
