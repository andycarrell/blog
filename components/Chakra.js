import {
  ThemeProvider,
  CSSReset,
  theme as defaultTheme,
} from "@chakra-ui/core";

const theme = {
  ...defaultTheme,
  fonts: {
    body: `Inter, ${defaultTheme.fonts.body}`,
    heading: `Inter, ${defaultTheme.fonts.heading}`,
    mono: `${defaultTheme.fonts.mono}`,
  },
};

export default function Chakra({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      {children}
    </ThemeProvider>
  );
}
