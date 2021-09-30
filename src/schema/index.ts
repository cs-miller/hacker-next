import { connectionPlugin, makeSchema } from "nexus";
import { join } from "path";

import * as types from "./types";

export const schema = makeSchema({
  types,
  features: {
    abstractTypeStrategies: {
      resolveType: false,
    },
  },
  plugins: [connectionPlugin()],
  outputs: {
    typegen: join(process.cwd(), "generated/nexus-typegen.ts"),
    schema: join(process.cwd(), "generated/schema.graphql"),
  },
});
