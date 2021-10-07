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
import { connectionFromArray, fromGlobalId } from "graphql-relay";

export const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.nonNull.id("id", {
      description: "GUID for a resource",
    });
  },
  // TODO: refine ts types here
  // @ts-ignore
  resolveType(source) {
    const { type } = fromGlobalId(source.id);
    return type;
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
    // TODO: use [backing types](https://nexusjs.org/docs/adoption-guides/nexus-framework-users#backing-types-type-discovery)
    // @ts-ignore
    switch (source.type) {
      case "story":
        return "Story";
      case "comment":
        return "Comment";
      case "job":
        return "Job";
      default:
        throw new Error("unable to resolve type");
    }
  },
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.implements("Node");
    t.nonNull.string("username", {
      description: "The user's unique username. Case-sensitive. Required.",
      resolve(source) {
        return source.id;
      },
    });
    t.nonNull.string("created", {
      description: "Creation date of the user, in Unix Time.",
    });
    t.nonNull.int("karma", {
      description: "The user's karma.",
    });
    t.string("about", {
      description: "The user's optional self-description. HTML.",
    });
    t.connectionField("submitted", {
      type: "Item",
      description: "List of the user's stories, polls and comments.",
      resolve(source, args, context, info) {
        return connectionFromArray([], args);
      },
    });
  },
});

export const Story = objectType({
  name: "Story",
  definition(t) {
    t.implements("Node");
    t.implements("Item");

    t.boolean("deleted", { description: "`true` if the item is deleted." });
    t.field("by", {
      type: "User",
      description: "The username of the item's author.",
    });
    t.string("time", {
      description: "Creation date of the item, in Unix Time.",
    });
    t.string("text", { description: "The comment, story or poll text. HTML." });
    t.boolean("dead", { description: "`true` if the item is dead." });
    t.connectionField("kids", {
      type: "Comment",
      description: "The ids of the item's comments, in ranked display order.",
      resolve(source, args, context, info) {
        return connectionFromArray([], args);
      },
    });
    t.string("url", { description: "The URL of the story." });
    t.int("score", {
      description: "The story's score, or the votes for a pollopt.",
    });
    t.string("title", {
      description: "The title of the story, poll or job. HTML.",
    });
    t.int("descendants", {
      description: "In the case of stories or polls, the total comment count.",
    });
  },
});

export const Comment = objectType({
  name: "Comment",
  definition(t) {
    t.implements("Node");
    t.implements("Item");

    t.boolean("deleted", { description: "`true` if the item is deleted." });
    t.field("by", {
      type: "User",
      description: "The username of the item's author.",
    });
    t.string("time", {
      description: "Creation date of the item, in Unix Time.",
    });
    t.string("text", { description: "The comment, story or poll text. HTML." });
    t.boolean("dead", { description: "`true` if the item is dead." });
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
      resolve() {
        return null;
      },
    });
    t.connectionField("kids", {
      type: "Comment",
      description: "The ids of the item's comments, in ranked display order.",
      resolve(source, args, context, info) {
        return connectionFromArray([], args);
      },
    });
  },
});

export const Job = objectType({
  name: "Job",
  definition(t) {
    t.implements("Node");
    t.implements("Item");

    t.boolean("deleted", { description: "`true` if the item is deleted." });
    t.field("by", {
      type: "User",
      description: "The username of the item's author.",
    });
    t.string("time", {
      description: "Creation date of the item, in Unix Time.",
    });
    t.string("text", { description: "The comment, story or poll text. HTML." });
    t.boolean("dead", { description: "`true` if the item is dead." });
    t.string("url", { description: "The URL of the story." });
    t.int("score", {
      description: "The story's score, or the votes for a pollopt.",
    });
    t.string("title", {
      description: "The title of the story, poll or job. HTML.",
    });
  },
});

export const FeedTypeEnum = enumType({
  name: "FeedTypeEnum",
  members: ["top", "new", "best", "ask", "show", "jobs"],
});

export const Query = queryType({
  definition(t) {
    t.connectionField("feed", {
      type: "Story",
      description: "feed of stories",
      additionalArgs: {
        feedType: arg({
          type: "FeedTypeEnum",
          default: "top",
        }),
      },
      resolve(source, args, context, info) {
        return connectionFromArray([], args);
      },
    });

    t.field("node", {
      type: "Node",
      args: {
        id: nonNull(idArg()),
      },
      resolve(source, args, context, info) {
        const { type, id } = fromGlobalId(args.id);
        switch (type) {
          case "User":
            return context.getUser(id);
          default:
            return context.getItem(id);
        }
      },
    });
  },
});
