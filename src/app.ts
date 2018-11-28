import express from "express";
import bodyParser from "body-parser";
require("dotenv").config();
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import logger from "./util/logger";
import  expressGraphQL from "express-graphql";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import schema from "./graphql/schema/test";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

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


app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

export default app;
