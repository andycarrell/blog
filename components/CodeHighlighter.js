import Highlight, { defaultProps } from "prism-react-renderer";
import defaultTheme from "prism-react-renderer/themes/nightOwlLight";
import prettier from "prettier/standalone";
import prettierParserBabel from "prettier/parser-babel";
import prettierParserYaml from "prettier/parser-yaml";

const theme = {
  ...defaultTheme,
  plain: { ...defaultTheme.plain, backgroundColor: "transparent" },
};

const formatYaml = (str) =>
  prettier
    .format(str, {
      printWidth: 75,
      parser: "yaml",
      plugins: [prettierParserYaml],
    })
    .trim();

const formatJavascript = (str) =>
  prettier
    .format(str, {
      printWidth: 75,
      parser: "babel",
      plugins: [prettierParserBabel],
    })
    .trim();

const formatFor = {
  none: (str) => str.trim(),
  javascript: formatJavascript,
  yaml: formatYaml,
};

const LineNumber = ({ children }) => (
  <span
    style={{
      display: "inline-block",
      position: "sticky",
      left: "0",
      width: "20px",
      backgroundColor: "#F7FAFC",
      boxShadow: "0 0 4px 2px #F7FAFC",
      marginRight: "2px",
    }}
  >
    <span style={{ fontSize: "14px", userSelect: "none", opacity: 0.3 }}>
      {children}
    </span>
  </span>
);

export default function CodeHighlighter({ children, language = "javascript" }) {
  const formatCode = formatFor[language] ?? formatJavascript;

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      language={language}
      code={formatCode(children)}
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
