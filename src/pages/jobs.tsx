import * as React from "react";
import type { RelayProps } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay";
import { withRelay } from "relay-nextjs";

import { getClientEnvironment } from "lib/clientEnvironment";
import { jobs_JobsStoriesQuery } from "__generated__/jobs_JobsStoriesQuery.graphql";
import { StoryFeed } from "components/StoryFeed";

const JobsStoriesQuery = graphql`
  query jobs_JobsStoriesQuery {
    ...StoryFeedPaginationFragment @arguments(feedType: JOBS, first: 30)
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface JobsStoriesFeedProps {}

const JobsStoriesFeed: React.FC<
  RelayProps<JobsStoriesFeedProps, jobs_JobsStoriesQuery>
> = (props) => {
  const query = usePreloadedQuery(JobsStoriesQuery, props.preloadedQuery);
  return <StoryFeed query={query} />;
};

function Loading() {
  return <div>Loading...</div>;
}

export default withRelay(JobsStoriesFeed, JobsStoriesQuery, {
  fallback: <Loading />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import("lib/serverEnvironment");
    return createServerEnvironment();
  },
});
