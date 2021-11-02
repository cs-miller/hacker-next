import * as React from "react";
import type { RelayProps } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay";
import { withRelay } from "relay-nextjs";

import { getClientEnvironment } from "lib/clientEnvironment";
import { StoryId_StoryPageQuery } from "__generated__/StoryId_StoryPageQuery.graphql";

const StoryPageQuery = graphql`
  query StoryId_StoryPageQuery($storyId: ID!) {
    node(id: $storyId) {
      id
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StoryPageProps {}

const StoryPage: React.FC<RelayProps<StoryPageProps, StoryId_StoryPageQuery>> =
  (props) => {
    const query = usePreloadedQuery(StoryPageQuery, props.preloadedQuery);
    return <pre>{query.node?.id}</pre>;
  };

function Loading() {
  return <div>Loading...</div>;
}

export default withRelay(StoryPage, StoryPageQuery, {
  fallback: <Loading />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import("lib/serverEnvironment");
    return createServerEnvironment();
  },
});
