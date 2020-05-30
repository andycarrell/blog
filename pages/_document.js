import Document, { Html, Head, Main, NextScript } from "next/document";

class Index extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="manifest" href="/site.webmanifest" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
            rel="stylesheet"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon.apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon.favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon.favicon-16x16.png"
          />
        </Head>
        <body style={{ overflowX: "hidden", margin: 0 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Index;
