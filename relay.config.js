module.exports = {
  src: "./src",
  schema: "./src/schema/__generated__/schema.graphql",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
  extensions: ["ts", "tsx"],
  language: "typescript",
  artifactDirectory: "src/__generated__",
};
