import {
  arg,
  enumType,
  idArg,
  interfaceType,
  nonNull,
  objectType,
  queryType,
  unionType,
} from "nexus";
import { connectionFromArray, fromGlobalId, toGlobalId } from "graphql-relay";
import { child, get, query } from "firebase/database";

export const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.nonNull.id("id", {
      description: "GUID for a resource",
    });
  },
  resolveType(source) {
    if ("type" in source) {
      switch (source.type) {
        case "comment":
          return "Comment";
        case "story":
          return "Story";
        case "job":
          return "Job";
      }
    }
    return "User";
  },
});

export const Item = interfaceType({
  name: "Item",
  definition(t) {
    t.nonNull.id("hnID", {
      description: "The item's unique id.",
      resolve(source) {
        return source.id;
      },
    });
  },
  resolveType(source) {
    switch (source.type) {
      case "story":
        return "Story";
      case "comment":
        return "Comment";
      case "job":
        return "Job";
    }
  },
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.implements("Node");

    t.nonNull.id("id", {
      resolve(source) {
        return toGlobalId("User", source.id);
      },
    });
    t.nonNull.string("username", {
      description: "The user's unique username. Case-sensitive. Required.",
      resolve(source) {
        return source.id;
      },
    });
    t.nonNull.int("created", {
      description: "Creation date of the user, in Unix Time.",
    });
    t.nonNull.int("karma", {
      description: "The user's karma.",
    });
    t.string("about", {
      description: "The user's optional self-description. HTML.",
    });
    t.nonNull.connectionField("submitted", {
      type: "Item",
      description: "List of the user's stories, polls and comments.",
      async resolve(source, args, context) {
        const connection = connectionFromArray<string>(source.submitted, args);
        const edges = await Promise.all(
          connection.edges.map(async (edge) => {
            const nodeSnapshot = await get(
              query(child(context.db, `/item/${edge.node}`))
            );
            const node = nodeSnapshot.val();
            return { ...edge, node };
          })
        );

        return { ...connection, edges };
      },
    });
  },
});

export const Story = objectType({
  name: "Story",
  definition(t) {
    t.implements("Node", "Item");

    t.nonNull.id("id", {
      resolve(source) {
        return toGlobalId("Story", source.id);
      },
    });
    t.boolean("deleted", { description: "`true` if the story is deleted." });
    t.nonNull.field("by", {
      type: "User",
      description: "The story's author.",
      resolve(source, args, context) {
        return get(query(child(context.db, `/user/${source.by}`))).then(
          (snapshot) => snapshot.val()
        );
      },
    });
    t.nonNull.int("time", {
      description: "Creation date of the story, in Unix Time.",
    });
    t.string("text", { description: "The story text. HTML." });
    t.boolean("dead", { description: "`true` if the story is dead." });
    t.nonNull.connectionField("kids", {
      type: "Comment",
      description: "The story's comments, in ranked display order.",
      async resolve(source, args, context) {
        const connection = connectionFromArray<string>(source.kids, args);
        const edges = await Promise.all(
          connection.edges.map(async (edge) => {
            const nodeSnapshot = await get(
              query(child(context.db, `/item/${edge.node}`))
            );
            const node = nodeSnapshot.val();
            return { ...edge, node };
          })
        );

        return { ...connection, edges };
      },
    });
    t.string("url", { description: "The URL of the story." });
    t.int("score", {
      description: "The story's score.",
    });
    t.string("title", {
      description: "The title of the story. HTML.",
    });
    t.int("descendants", {
      description: "The total comment count.",
    });
  },
});

export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.implements("Node", "Item");

    t.nonNull.id("id", {
      resolve(source) {
        return toGlobalId("Comment", source.id);
      },
    });
    t.boolean("deleted", { description: "`true` if the comment is deleted." });
    t.nonNull.field("by", {
      type: "User",
      description: "The comment's author.",
      resolve(source, args, context) {
        return get(query(child(context.db, `/user/${source.by}`))).then(
          (snapshot) => snapshot.val()
        );
      },
    });
    t.nonNull.int("time", {
      description: "Creation date of the comment, in Unix Time.",
    });
    t.string("text", { description: "The comment text. HTML." });
    t.boolean("dead", { description: "`true` if the comment is dead." });
    t.field("parent", {
      type: unionType({
        name: "Parent",
        definition(t) {
          t.members("Story", "Comment");
        },
        resolveType(source) {
          switch (source.type) {
            case "story":
              return "Story";
            case "comment":
              return "Comment";
            default:
              throw new Error("invalid comment parent");
          }
        },
      }),
      description:
        "The comment's parent: either another comment or the relevant story.",
      resolve(source, args, context) {
        return get(query(child(context.db, `/item/${source.parent}`))).then(
          (snapshot) => snapshot.val()
        );
      },
    });
    t.nonNull.connectionField("kids", {
      type: "Comment",
      description: "The comment's comments, in ranked display order.",
      async resolve(source, args, context) {
        const connection = connectionFromArray<string>(source.kids, args);
        const edges = await Promise.all(
          connection.edges.map(async (edge) => {
            const nodeSnapshot = await get(
              query(child(context.db, `/item/${edge.node}`))
            );
            const node = nodeSnapshot.val();
            return { ...edge, node };
          })
        );

        return { ...connection, edges };
      },
    });
  },
});

export const Job = objectType({
  name: "Job",
  definition(t) {
    t.implements("Node", "Item");

    t.nonNull.id("id", {
      resolve(source) {
        return toGlobalId("Job", source.id);
      },
    });
    t.boolean("deleted", { description: "`true` if the job is deleted." });
    t.nonNull.field("by", {
      type: "User",
      description: "The job's author.",
      resolve(source, args, context) {
        return get(query(child(context.db, `/user/${source.by}`))).then(
          (snapshot) => snapshot.val()
        );
      },
    });
    t.nonNull.int("time", {
      description: "Creation date of the job, in Unix Time.",
    });
    t.string("text", { description: "The job text. HTML." });
    t.boolean("dead", { description: "`true` if the job is dead." });
    t.string("url", { description: "The URL of the job." });
    t.int("score", {
      description: "The jobs's score.",
    });
    t.string("title", {
      description: "The title of the job. HTML.",
    });
  },
});

export const FeedTypeEnum = enumType({
  name: "FeedTypeEnum",
  members: {
    TOP: "topstories",
    NEW: "newstories",
    BEST: "beststories",
    ASK: "askstories",
    SHOW: "showstories",
    JOBS: "jobstories",
  },
});

export const Query = queryType({
  definition(t) {
    t.nonNull.connectionField("feed", {
      type: "Story",
      description: "feed of stories",
      additionalArgs: {
        feedType: nonNull(
          arg({
            type: "FeedTypeEnum",
          })
        ),
      },
      async resolve(source, args, context) {
        const storiesSnapshot = await get(
          query(child(context.db, args.feedType))
        );
        const connection = connectionFromArray<string>(
          storiesSnapshot.val(),
          args
        );
        const edges = await Promise.all(
          connection.edges.map(async (edge) => {
            const nodeSnapshot = await get(
              query(child(context.db, `/item/${edge.node}`))
            );
            const node = nodeSnapshot.val();
            return { ...edge, node };
          })
        );

        return { ...connection, edges };
      },
    });

    t.field("node", {
      type: "Node",
      args: {
        id: nonNull(idArg()),
      },
      async resolve(source, args, context, info) {
        const { type, id } = fromGlobalId(args.id);
        switch (type) {
          case "User":
            return get(query(child(context.db, `/user/${id}`))).then(
              (snapshot) => snapshot.val()
            );
          default:
            return get(query(child(context.db, `/item/${id}`))).then(
              (snapshot) => snapshot.val()
            );
        }
      },
    });
  },
});
