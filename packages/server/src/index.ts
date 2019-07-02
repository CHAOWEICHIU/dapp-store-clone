import * as casual from "casual";
import { v4 as uuid } from "uuid";
import { ResolverMap } from "./types/graphql-utils";
import { calculation } from "@monorepo/common";
const { add } = calculation;

const { ApolloServer, gql, MockList } = require("apollo-server");

require("dotenv").config();

const { PORT = 3000, ENGINE_API_KEY } = process.env;

const typeDefs = gql`
  type Photo {
    uid: ID
    name: String
    src: String
  }

  type Category {
    uid: ID
    name: String
  }

  type User {
    uid: ID
    email: String
    name: String
  }

  type App {
    uid: ID
    authors: [User]

    name: String
    introduction: String
    category: Category
    url: String
    photos: [Photo]
  }

  type Contract {
    address: String
    explorerLink: String
  }

  type Query {
    add(a: String, b: String): String
    me: User
    users: [User]
    apps: [App]
    banners: [Photo]
  }

  type Mutation {
    register(email: String!, password: String!): Boolean
  }
`;

const resolvers: ResolverMap = {
  Query: {
    add: (parent: any, args: any): String => {
      return add(args.a, args.b);
    }
  },
  Mutation: {}
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: { apiKey: ENGINE_API_KEY },
  mocks: {
    User: () => ({
      uid: uuid(),
      email: casual.email,
      name: casual.name
    }),
    App: () => ({
      uid: uuid(),
      authors: () => new MockList([1, 4]),
      name: casual.title,
      introduction: casual.description,
      url: casual.url,
      photos: () => new MockList([2, 5])
    }),
    Photo: () => ({
      uid: uuid(),
      name: casual.name
    }),
    Query: () => ({
      apps: () => new MockList([1, 30])
    })
  }
});

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
