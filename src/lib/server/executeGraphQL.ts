import { Source, graphql, ExecutionResult } from "graphql";
import { getDatabase, ref } from "firebase/database";

import { hnFirebase } from "lib/server/hnFirebase";
import { schema } from "lib/server/schema";

export async function executeGraphQL(
  source: string | Source,
  variables?: Record<string, unknown>
): Promise<
  ExecutionResult<{ [p: string]: unknown }, { [p: string]: unknown }>
> {
  return graphql(
    schema,
    source,
    {},
    { db: ref(getDatabase(hnFirebase), "v0") },
    variables
  );
}
