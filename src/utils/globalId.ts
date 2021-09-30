import { GraphQLID } from "graphql";

import { base64, unbase64 } from "./base64";

export type ResolvedGlobalId = {
  id: string;
  type: string;
};

export function toGlobalId(type: string, id: string | number): string {
  return base64([type, GraphQLID.serialize(id)].join(":"));
}

export function fromGlobalId(globalId: string): ResolvedGlobalId {
  const unbasedGlobalId = unbase64(globalId);
  const delimiterPos = unbasedGlobalId.indexOf(":");
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1),
  };
}
