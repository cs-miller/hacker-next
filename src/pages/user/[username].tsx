import * as React from "react";
import type { RelayProps } from "relay-nextjs";
import { graphql, usePreloadedQuery } from "react-relay";
import { withRelay } from "relay-nextjs";

import { getClientEnvironment } from "lib/clientEnvironment";
import { Username_UserPageQuery } from "__generated__/Username_UserPageQuery.graphql";

const UserPageQuery = graphql`
  query Username_UserPageQuery($username: ID!) {
    node(id: $username) {
      id
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface UserPageProps {}

const UserPage: React.FC<RelayProps<UserPageProps, Username_UserPageQuery>> = (
  props
) => {
  const query = usePreloadedQuery(UserPageQuery, props.preloadedQuery);
  return <pre>{query.node?.id}</pre>;
};

function Loading() {
  return <div>Loading...</div>;
}

export default withRelay(UserPage, UserPageQuery, {
  fallback: <Loading />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import("lib/serverEnvironment");
    return createServerEnvironment();
  },
});
