import Page from "../components/Page";
import useTitle from "../hooks/useTitle";
import Post1 from "../posts/Post1";

export default function Index() {
  useTitle("andycarrell > Blog");

  return (
    <Page>
      <Post1 />
    </Page>
  );
}
