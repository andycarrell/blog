import { useEffect } from "react";
import Head from "next/head";

export default function TwitterEmbed() {
  useEffect(() => {
    if (window.twttr) {
      return;
    }

    let twitterEmbed = { _e: [] };

    twitterEmbed.ready = (f) => {
      twitterEmbed._e = [...twitterEmbed._e, f];
    };

    window.twttr = twitterEmbed;
  });

  return (
    <Head>
      <script
        id="twitter-wjs"
        key="twitter-wjs"
        src="https://platform.twitter.com/widgets.js"
        async
      />
    </Head>
  );
}
