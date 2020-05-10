import Document, { Html, Head, Main, NextScript } from "next/document";

class Index extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <title>andycarrell > Blog</title>
          <meta
            content="Andy Carrell's blog site"
            name="description"
            key="description"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@700&family=Inter&display=swap"
            rel="stylesheet"
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
