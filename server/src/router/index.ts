import express from "express";

import authentication from "./authentication";
import users from "./users";
import quiz from "./quiz";
import subscribers from "./subscribers";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  quiz(router);
  subscribers(router);

  return router;
};
