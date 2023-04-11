import express from "express";
import { authentication, random } from "../utils";
import { createUser, getUserByEmail } from "../db/users";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Missing fields");
    }

    const user = await getUserByEmail(email).select(
      "+authentication.password +authentication.salt"
    );

    if (!user) {
      throw new Error("User does not exist");
    }

    const expectedPassword = authentication(user.authentication.salt, password);

    if (expectedPassword !== user.authentication.password) {
      throw new Error("Invalid password");
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("APP-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    //remove sensitive data
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!username || !email || !password) {
      throw new Error("Missing fields");
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const salt = random();

    const user = createUser({
      email,
      username,
      authentication: {
        password: authentication(salt, password),
        salt,
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};
