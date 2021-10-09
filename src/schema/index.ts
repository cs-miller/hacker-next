import { connectionPlugin, makeSchema } from "nexus";
import { join } from "path";

import * as types from "./types";

export const schema = makeSchema({
  types,
  plugins: [connectionPlugin()],
  sourceTypes: {
    modules: [
      {
        module: join(process.cwd(), "src/types/sourceTypes.ts"),
        alias: "sourceTypes",
      },
    ],
  },
  outputs: {
    typegen: join(process.cwd(), "src/schema/__generated__/nexus-typegen.ts"),
    schema: join(process.cwd(), "src/schema/__generated__/schema.graphql"),
  },
});
