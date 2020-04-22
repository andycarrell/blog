import Page from "../../components/Page";
import useTitle from "../../hooks/useTitle";
import Post1 from "../../posts/Post1";

export default function MockingGraphQLInCypress() {
  useTitle("andycarrell > Mocking GraphQL in Cypress");

  return (
    <Page>
      <Post1 />
    </Page>
  );
}
