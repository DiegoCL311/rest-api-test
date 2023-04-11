import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

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

const MONGO_URL =
  "mongodb+srv://311:YHDb6uSkzAKgJANC@cluster0.c22j2nr.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err: Error) => {
  console.log("Error connecting to MongoDB", err);
});
mongoose.connect(MONGO_URL);

app.use("/", router());
