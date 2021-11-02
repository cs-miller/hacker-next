import * as React from "react";
import type { RelayProps } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay";
import { withRelay } from "relay-nextjs";

import { getClientEnvironment } from "lib/clientEnvironment";
import { show_ShowStoriesQuery } from "__generated__/show_ShowStoriesQuery.graphql";
import { StoryFeed } from "components/StoryFeed";

const ShowStoriesQuery = graphql`
  query show_ShowStoriesQuery {
    ...StoryFeedPaginationFragment @arguments(feedType: SHOW, first: 30)
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ShowStoriesFeed {}

const ShowStoriesFeed: React.FC<
  RelayProps<ShowStoriesFeed, show_ShowStoriesQuery>
> = (props) => {
  const query = usePreloadedQuery(ShowStoriesQuery, props.preloadedQuery);
  return <StoryFeed query={query} />;
};

function Loading() {
  return <div>Loading...</div>;
}

export default withRelay(ShowStoriesFeed, ShowStoriesQuery, {
  fallback: <Loading />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import("lib/serverEnvironment");
    return createServerEnvironment();
  },
});
