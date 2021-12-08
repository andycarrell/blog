import type { MetaFunction } from "remix";

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "andycarrell > Blog",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  return (
    <div className="remix__page">
      <main>
        <h2>Welcome to Andy Carrell's personal website!</h2>
        <p>Stoked that you're here. 🥳</p>
        <p>
          Why does this look exactly like the{" "}
          <a href="https://remix.run/docs">Remix Docs</a>? I built this site
          following the{" "}
          <a href="https://remix.run/docs/en/v1/tutorials/blog">
            Remix Blog Tutorial
          </a>
          .
          <br />
          Once initial posts are deployed, styling is the next job. 💃
        </p>
        <p>
          Find out more about <code>remix</code> on their{" "}
          <a href="https://github.com/remix-run/remix">GitHub</a>.
        </p>
      </main>
    </div>
  );
}
