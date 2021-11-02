import * as React from "react";
import type { RelayProps } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay";
import { withRelay } from "relay-nextjs";

import { getClientEnvironment } from "lib/clientEnvironment";
import type { pages_TopStoriesQuery } from "__generated__/pages_TopStoriesQuery.graphql";
import { StoryFeed } from "components/StoryFeed";

const TopStoriesQuery = graphql`
  query pages_TopStoriesQuery {
    ...StoryFeedPaginationFragment @arguments(feedType: TOP, first: 30)
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TopStoriesFeedProps {}

const TopStoriesFeed: React.FC<
  RelayProps<TopStoriesFeedProps, pages_TopStoriesQuery>
> = (props) => {
  const query = usePreloadedQuery(TopStoriesQuery, props.preloadedQuery);
  return <StoryFeed query={query} />;
};

function Loading() {
  return <div>Loading...</div>;
}

export default withRelay(TopStoriesFeed, TopStoriesQuery, {
  fallback: <Loading />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import("lib/serverEnvironment");
    return createServerEnvironment();
  },
});
