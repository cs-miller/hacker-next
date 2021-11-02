import * as React from "react";
import type { RelayProps } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay";
import { withRelay } from "relay-nextjs";

import { getClientEnvironment } from "lib/clientEnvironment";
import { ask_AskStoriesQuery } from "__generated__/ask_AskStoriesQuery.graphql";
import { StoryFeed } from "components/StoryFeed";

const AskStoriesQuery = graphql`
  query ask_AskStoriesQuery {
    ...StoryFeedPaginationFragment @arguments(feedType: ASK, first: 30)
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AskStoriesFeedProps {}

const AskStoriesFeed: React.FC<
  RelayProps<AskStoriesFeedProps, ask_AskStoriesQuery>
> = ({ preloadedQuery }) => {
  const query = usePreloadedQuery(AskStoriesQuery, preloadedQuery);
  return <StoryFeed query={query} />;
};

function Loading() {
  return <div>Loading...</div>;
}

export default withRelay(AskStoriesFeed, AskStoriesQuery, {
  fallback: <Loading />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import("lib/serverEnvironment");
    return createServerEnvironment();
  },
});
