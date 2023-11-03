import mongoose from "mongoose";

// User Config
const SubscribersSchema = new mongoose.Schema({
  countryCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

export interface IUser extends mongoose.Document {
  countryCode: string;
  phoneNumber: string;
}

export const SubscribersModel = mongoose.model<IUser>(
  "Subscriber",
  SubscribersSchema
);

// Actions
export const getSubscribers = () => SubscribersModel.find();

export const getSubscribersWithPagination = (skip: number, pageSize: number) =>
  SubscribersModel.find().skip(skip).limit(pageSize).exec();

export const getSubscriberByID = (id: string) => SubscribersModel.findById(id);

export const createSubscriber = (values: Record<string, any>) =>
  new SubscribersModel(values).save().then((sub) => sub.toObject());
