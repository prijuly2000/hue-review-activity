const { ApolloServer, gql } = require("apollo-server");
const { addColor, countColors, findColors } = require("./lib");
const { buildFederatedSchema } = require("@apollo/federation");

const typeDefs = gql`
  scalar DateTime

  type Color {
    id: ID!
    title: String!
    value: String!
    created: DateTime!
    createdBy: User! @provides(fields: "name")
  }

  extend type User @key(fields: "email") {
    email: ID! @external
    name: String! @external
  }

  type Query {
    totalColors: Int!
    allColors: [Color!]!
  }
`;

const resolvers = {
  Query: {
    totalColors: (_, __, { countColors }) => countColors(),
    allColors: (_, __, { findColors }) => findColors()
  }
};

const start = async () => {
  const server = new ApolloServer({
    schema: buildFederatedSchema({
      typeDefs,
      resolvers
    }),
    context: ({ req }) => ({
      countColors,
      findColors,
      addColor
    })
  });

  server.listen(process.env.PORT).then(({ url }) => {
    console.log(`       🎨 🖍  - Color service running at: ${url}`);
  });
};

start();
