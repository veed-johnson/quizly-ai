import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN 
);
import {
  SubscribersModel,
  getSubscriberByID,
  getSubscribersWithPagination,
} from "../../db/Subscribers";
import express from "express";

const WELCOME_SMS =
  "Hi player. Thank you for subscribing to Quizly AI! Rest assured, you will only receive messages from us when a new quiz goes live. \nStay tuned for exciting quizzes and challenges!";

const getSubscribers = async function (
  req: express.Request,
  res: express.Response
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const skip = (page - 1) * pageSize;

    const [subscribers, totalItems] = await Promise.all([
      await getSubscribersWithPagination(skip, pageSize),
      SubscribersModel.countDocuments(),
    ]);

    const totalPages = Math.ceil(Number(totalItems) / Number(pageSize));

    return res.status(200).json({
      currentPage: page,
      itemsPerPage: pageSize,
      totalItems,
      totalPages,
      subscribers,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
    console.error(err);
  }
};

const addSubscriber = async (req: express.Request, res: express.Response) => {
  try {
    const { countryCode, phoneNumber } = req.body;

    const existingSubscriber = await SubscribersModel.findOne({
      countryCode,
      phoneNumber,
    });

    if (existingSubscriber) {
      return res.status(400).json({ error: "Subscriber already exists" });
    }

    const newSubscriber = new SubscribersModel({
      countryCode,
      phoneNumber,
    });

    const savedSubscriber = await newSubscriber.save();

    // sendWelcomeSMS(`+${countryCode}${phoneNumber}`, WELCOME_SMS);
    res.status(201).json(savedSubscriber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add a new subscriber" });
  }
};

const deleteSubscriber = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const subscriberId = req.params.id;

    const existingSubscriber = await getSubscriberByID(subscriberId);

    if (!existingSubscriber) {
      return res.status(404).json({ error: "Subscriber not found" });
    }

    await SubscribersModel.deleteOne({ _id: subscriberId });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the subscriber" });
  }
};

const welcomeSubscriber = async function (
  req: express.Request,
  res: express.Response
) {
  const phoneNumber = req.params.number;

  twilioClient.messages
    .create({
      to: `+${phoneNumber}`,
      from: process.env.TWILIO_NUMBER,
      body: WELCOME_SMS,
    })
    .then((message) => {
      console.log(message.sid);
      res.json({ sid: message.sid }).end();
    })
    .catch((err) => {
      console.error(err);
      res.json(err).end();
    });
};

export { addSubscriber, getSubscribers, deleteSubscriber, welcomeSubscriber };
