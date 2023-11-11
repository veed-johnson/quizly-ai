import express from "express";

import { getUserByEmail, createUser } from "../../db/Users";
import { authentication, random } from "../../helpers";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res
        .status(404)
        .send({ error: "No user found for this email address." });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.status(403).send({ error: "Incorrect email or password" });
    }

    if (!user.isAdmin) {
      return res
        .status(403)
        .send({ error: "You need to be an admin to access this data" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie(process.env.AUTH_COOKIE, user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Your request could not be processed. Please try again.",
    });
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = random();
    const user = await createUser({
      email,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
