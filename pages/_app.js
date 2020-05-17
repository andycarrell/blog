import Head from "next/head";
import Chakra from "components/Chakra";
import { Header, Page } from "components/layout";
import TwitterEmbed from "components/TwitterEmbed";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>andycarrell > Blog</title>
        <meta
          content="Andy Carrell's blog site"
          name="description"
          key="description"
        />
        <meta content="#38B2AC" name="theme-color" key="theme-color" />
      </Head>
      <Chakra>
        <Header />
        <Component {...pageProps} />
      </Chakra>
      <TwitterEmbed />
    </>
  );
}
