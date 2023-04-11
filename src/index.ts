import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

require('dotenv').config()

const app = express();
app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server started on port 8080");
});

const MONGO_URL = process.env.MONGO_URL;

mongoose.Promise = global.Promise;
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err: Error) => {
  console.log("Error connecting to MongoDB", err);
});
mongoose.connect(MONGO_URL);

app.use("/", router());
