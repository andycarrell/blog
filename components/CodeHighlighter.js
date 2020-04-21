import { Text } from "@chakra-ui/core";
import Highlight, { defaultProps } from "prism-react-renderer";
import defaultTheme from "prism-react-renderer/themes/nightOwlLight";

const theme = {
  ...defaultTheme,
  plain: { ...defaultTheme.plain, backgroundColor: "transparent" },
};

const LineNumber = ({ children }) => (
  <Text
    as="span"
    fontSize="sm"
    display="inline-block"
    userSelect="none"
    marginBottom="1px"
    marginRight={2}
    opacity="0.3"
    width={4}
  >
    {children}
  </Text>
);

export default function CodeHighlighter({ children }) {
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      language="javascript"
      code={children}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              <LineNumber>{i + 1}</LineNumber>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </div>
      )}
    </Highlight>
  );
}
