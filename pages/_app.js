import { Fragment } from "react";
import App from "next/app";
import Head from "next/head";
import Chakra from "components/Chakra";
import { Header, Page } from "components/layout";

class Index extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <Fragment>
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
          <Page>
            <Component {...pageProps} />
          </Page>
        </Chakra>
      </Fragment>
    );
  }
}

export default Index;
