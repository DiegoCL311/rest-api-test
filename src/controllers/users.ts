import express from "express";

import { getUsers, deleteUserById, getuserById } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const user = await deleteUserById(id);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { username } = req.body;
    const { id } = req.params;

    if (!username) {
      throw new Error("Missing username");
    }

    const user = await getuserById(id);

    user.username = username;

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};
