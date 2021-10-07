import { enumType, interfaceType, objectType, queryType } from "nexus";

export const Node = interfaceType({
  name: "Node",
  definition(t) {
    t.nonNull.id("id", { description: "GUID for a resource" });
  },
});

export const ItemTypeEnum = enumType({
  name: "ItemTypeEnum",
  members: ["job", "story", "comment", "poll", "pollopt"],
});

export const Item = interfaceType({
  name: "Item",
  definition(t) {
    // t.id('id', {description: "The item's unique id."})
    t.boolean("deleted", { description: "`true` if the item is deleted." });
    t.field("type", {
      type: "ItemTypeEnum",
      description:
        "The type of item. One of 'job', 'story', 'comment', 'poll', or 'pollopt'.",
    });
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
      type: "Item",
      description:
        "The comment's parent: either another comment or the relevant story.",
      resolve() {
        return {};
      },
    });
    t.field("poll", {
      type: "Item",
      description: "The pollopt's associated poll.",
      resolve() {
        return {};
      },
    });
    t.list.field("kids", {
      type: "Item",
      description: "The ids of the item's comments, in ranked display order.",
      resolve() {
        return [];
      },
    });
    t.string("url", { description: "The URL of the story." });
    t.int("score", {
      description: "The story's score, or the votes for a pollopt.",
    });
    t.string("title", {
      description: "The title of the story, poll or job. HTML.",
    });
    t.list.field("parts", {
      type: "Item",
      description: "A list of related pollopts, in display order.",
      resolve() {
        return [];
      },
    });
    t.int("descendants", {
      description: "In the case of stories or polls, the total comment count.",
    });
  },
});

export const User = objectType({
  name: "User",
  definition(t) {
    t.implements("Node");
    t.nonNull.string("username", {
      description: "The user's unique username. Case-sensitive. Required.",
      resolve(parent) {
        return parent.id;
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
    t.list.field("submitted", {
      type: "Item",
      description: "List of the user's stories, polls and comments.",
      resolve() {
        return [];
      },
    });
  },
});
