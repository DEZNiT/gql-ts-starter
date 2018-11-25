import express from "express";
import bodyParser from "body-parser";
require("dotenv").config();
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import logger from "./util/logger";
import { ApolloServer, gql } from "apollo-server-express";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  mongodb mongoose connection
const mongoUrl = MONGODB_URI;

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
mongoose
  .connect(
    mongoUrl,
    { useNewUrlParser: true }
  )
  .catch(err => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
  });
//  gql

const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];
// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    books: () => books
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });
console.log(server.graphqlPath);

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

export default app;
