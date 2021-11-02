import * as React from "react";
import type { RelayProps } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay";
import { withRelay } from "relay-nextjs";

import { getClientEnvironment } from "lib/clientEnvironment";
import { new_NewStoriesQuery } from "__generated__/new_NewStoriesQuery.graphql";
import { StoryFeed } from "components/StoryFeed";

const NewStoriesQuery = graphql`
  query new_NewStoriesQuery {
    ...StoryFeedPaginationFragment @arguments(feedType: NEW, first: 30)
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NewStoriesFeedProps {}

const NewStoriesFeed: React.FC<
  RelayProps<NewStoriesFeedProps, new_NewStoriesQuery>
> = ({ preloadedQuery }) => {
  const query = usePreloadedQuery(NewStoriesQuery, preloadedQuery);
  return <StoryFeed query={query} />;
};

function Loading() {
  return <div>Loading...</div>;
}

export default withRelay(NewStoriesFeed, NewStoriesQuery, {
  fallback: <Loading />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import("lib/serverEnvironment");
    return createServerEnvironment();
  },
});
