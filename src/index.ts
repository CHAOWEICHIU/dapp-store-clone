import { ApolloServer, gql, MockList } from "apollo-server";
import * as firebase from "firebase";
import { ResolverMap, UserInput } from "./types/graphql-utils";

const casual = require("casual");
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
