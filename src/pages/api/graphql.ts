import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-micro";
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";

import type { NextApiRequest, NextApiResponse } from "next";

import { schema } from "schema";

initializeApp({
  databaseURL: "https://hacker-news.firebaseio.com",
});

const apolloServer = new ApolloServer({
  context() {
    return { db: ref(getDatabase(), "v0") };
  },
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
