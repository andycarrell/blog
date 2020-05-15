import { Fragment } from "react";
import App from "next/app";
import Head from "next/head";
import Page from "components/Page";

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
        <Page>
          <Component {...pageProps} />
        </Page>
      </Fragment>
    );
  }
}

export default Index;
