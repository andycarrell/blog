import Page from "../components/Page";
import Post1 from "../components/posts/Post1";
import useTitle from "../hooks/useTitle";

export default function Index() {
  useTitle("andycarrell > Blog");

  return (
    <Page>
      <Post1 />
    </Page>
  );
}
