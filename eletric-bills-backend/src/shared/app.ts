import "reflect-metadata";
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import cors from "cors";
import AWS from "aws-sdk";
import { router } from "./infra/http/routes";

import "./container";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PATCH"] }));
app.use(express.json());
app.use(morgan("common"));
app.use(router);
app.get("/", (request, response) => {
  response.json({ message: "My app is running" });
});

export { app };
