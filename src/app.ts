import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
// import mongo from "connect-mongo";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

export default app;
