import { makeSchema } from "nexus";
import { join } from "path";

export const schema = makeSchema({
  types: [],
  outputs: {
    typegen: join(process.cwd(), "generated/nexus-typegen.ts"),
    schema: join(process.cwd(), "generated/schema.graphql"),
  },
});
