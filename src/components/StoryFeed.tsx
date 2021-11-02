import * as React from "react";
import { graphql, usePaginationFragment } from "react-relay";

import type { StoryFeedPaginationFragment$key } from "__generated__/StoryFeedPaginationFragment.graphql";
import type { StoryFeedPaginationQuery } from "__generated__/StoryFeedPaginationQuery.graphql";

import { StoryCard } from "components/StoryCard";
import { ConstrainedLayout } from "components/ConstrainedLayout";
import { Header } from "components/Header";

const StoryFeedPaginationFragment = graphql`
  fragment StoryFeedPaginationFragment on Query
  @argumentDefinitions(
    feedType: { type: "FeedTypeEnum", defaultValue: TOP }
    first: { type: "Int", defaultValue: 30 }
    after: { type: "String" }
  )
  @refetchable(queryName: "StoryFeedPaginationQuery") {
    feed(feedType: $feedType, first: $first, after: $after)
      @connection(key: "StoryFeed_feed") {
      edges {
        cursor
        node {
          ...StoryCard_story
        }
      }
    }
  }
`;

interface StoryFeedProps {
  query: StoryFeedPaginationFragment$key;
}

export const StoryFeed: React.FC<StoryFeedProps> = (props) => {
  const { data } = usePaginationFragment<
    StoryFeedPaginationQuery,
    StoryFeedPaginationFragment$key
  >(StoryFeedPaginationFragment, props.query);

  return (
    <ConstrainedLayout>
      <Header />
      <ul role="list" className="space-y-3">
        {(data.feed.edges ?? []).map((edge) => {
          if (edge && edge.node)
            return <StoryCard key={edge.cursor} story={edge.node} />;
        })}
      </ul>
    </ConstrainedLayout>
  );
};
