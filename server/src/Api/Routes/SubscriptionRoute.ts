import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";
import { QuizController } from "../Controllers/QuizController";
import { Router } from "express";
import { SubscriptionController } from "../../Api/Controllers/SubscriptionController";



const SubscriptionRoute = Router();

const subscriptionController = new SubscriptionController(applicationFeatureFactory.SubscriptionFeatures());

SubscriptionRoute.get("/getsubscribers", subscriptionController.GetSubscribers);
SubscriptionRoute.post("/addsubscriber", subscriptionController.AddSubscriber);
SubscriptionRoute.delete("/deletesubcriber", subscriptionController.DeleteSubscriber);
export {SubscriptionRoute};

