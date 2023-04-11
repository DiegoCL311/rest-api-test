import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["APP-AUTH"];
    if (!sessionToken) {
      throw new Error("Missing session token");
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      throw new Error("Invalid session token");
    }

    merge(req, { identity: user });

    return next();
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = get(req, "identity._id") as string;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    if (userId.toString() !== id) {
      throw new Error("Unauthorized");
    }

    return next();
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};
