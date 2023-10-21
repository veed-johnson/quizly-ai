import express from "express";

import { addSubscriber } from "../controllers/subscribers";

export default (router: express.Router) => {
  router.post("/subscribe", addSubscriber);
};
