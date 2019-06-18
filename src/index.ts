import { ApolloServer, gql } from "apollo-server";
import * as firebase from "firebase";
import { ResolverMap, UserInput } from "./types/graphql-utils";

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const uuid = require("uuid/v4");
require("dotenv").config();

const {
  PORT = 3000,
  FIREBASE_API_KEY,
  FIREBASE_DB_URL,
  ENGINE_API_KEY
} = process.env;

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  databaseURL: FIREBASE_DB_URL
});

function createUser({ email, password }: UserInput): Promise<boolean> {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref("users/" + uuid())
      .set({
        email,
        password
      })
      .then(() => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function getUsers() {
  return new Promise((resolve, reject) => {
    firebase
      .database()
      .ref("users")
      .on(
        "value",
        snapshot => {
          resolve(Object.keys(snapshot.val()).map(x => ({ id: x })));
        },
        (errorObject: any) => {
          reject(errorObject);
        }
      );
  });
}

const typeDefs = gql`
  type Hello {
    id: ID
  }

  type Query {
    users: [Hello]
  }

  type Mutation {
    register(email: String!, password: String!): Boolean
  }
`;

const resolvers: ResolverMap = {
  Query: {
    users: () => {
      return getUsers();
    }
  },
  Mutation: {
    register: async (_, { email, password }: UserInput): Promise<boolean> => {
      const hashedPassword = await bcrypt.hashSync(password, salt);
      return createUser({ email, password: hashedPassword });
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  engine: { apiKey: ENGINE_API_KEY }
});

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
