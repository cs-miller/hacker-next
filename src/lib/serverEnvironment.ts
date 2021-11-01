import { graphql } from "graphql";
import { withHydrateDatetime } from "relay-nextjs/date";
import {
  Environment,
  GraphQLResponse,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";
import { getDatabase, ref } from "firebase/database";

import { schema } from "./server/schema";
import { hnFirebase } from "./server/hnFirebase";

export function createServerNetwork() {
  return Network.create(async (request, variables) => {
    const results = await graphql(
      schema,
      request.text as string,
      {},
      { db: ref(getDatabase(hnFirebase), "v0") },
      variables
    );

    const data = JSON.parse(
      JSON.stringify(results),
      withHydrateDatetime
    ) as GraphQLResponse;

    return data;
  });
}

// Optional: this function can take a token used for authentication and pass it into `createServerNetwork`.
export function createServerEnvironment(): Environment {
  return new Environment({
    network: createServerNetwork(),
    store: new Store(new RecordSource()),
    isServer: true,
  });
}
