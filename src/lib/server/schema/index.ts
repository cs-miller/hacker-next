import { connectionPlugin, makeSchema } from "nexus";
import { join } from "path";

import * as types from "./types";

export const schema = makeSchema({
  types,
  plugins: [connectionPlugin()],
  sourceTypes: {
    modules: [
      {
        module: join(process.cwd(), "src/lib/server/sourceTypes.ts"),
        alias: "sourceTypes",
      },
    ],
  },
  outputs: {
    typegen: join(
      process.cwd(),
      "src/lib/server/schema/__generated__/nexus-typegen.ts"
    ),
    schema: join(
      process.cwd(),
      "src/lib/server/schema/__generated__/schema.graphql"
    ),
  },
});
