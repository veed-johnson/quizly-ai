import express from "express";

import {
  addSubscriber,
  deleteSubscriber,
  getSubscribers,
  welcomeSubscriber,
} from "../Api/controllers/subscribers";
// import { sendWelcomeSMS } from "../services/sms";

export default (router: express.Router) => {
  router.post("/subscribe", addSubscriber);
  router.get("/subscribers", getSubscribers);
  router.get("/subscriber/welcome/:number", welcomeSubscriber);
  router.delete("/subscribers/:id", deleteSubscriber);
};
