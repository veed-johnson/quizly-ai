import { SubscribersModel } from "../db/Subscribers";
import express from "express";

const addSubscriber = async (req: express.Request, res: express.Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;

    // Check if the subscriber already exists
    const existingSubscriber = await SubscribersModel.findOne({
      countryCode,
      phoneNumber,
    });

    if (existingSubscriber) {
      return res.status(400).json({ error: "Subscriber already exists" });
    }

    // Create a new subscriber
    const newSubscriber = new SubscribersModel({
      countryCode,
      phoneNumber,
    });

    // Save the subscriber to the database
    const savedSubscriber = await newSubscriber.save();

    // Return the saved subscriber as a response
    res.status(201).json(savedSubscriber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add a new subscriber" });
  }
};

export { addSubscriber };
