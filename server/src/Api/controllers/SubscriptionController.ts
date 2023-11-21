import { PaginatedQueryParamsRequest } from "../../Application/DTO/Models/PaginatedQueryParamsRequest";
import { ISubscriptionFeatures } from "../../Application/Contracts/Features/SubscriptionFeature/ISubscriptionFeatures";
import {NextFunction, Request, Response} from "express";
import { AddSubscriberRequest } from "../../Application/DTO/Requests/SubscriberRequests/AddSubscriberRequest";
import { Subscriber } from "../../Domain/Entities/SubscriptionModule/Subscriber";
import { QuizByIdQueryParam } from "../../Application/DTO/Requests/SubscriberRequests/QuizByIdQueryParam";

export class SubscriptionController {
    private readonly _subscriptionFeature: ISubscriptionFeatures
    public constructor(subscriptionFeature: ISubscriptionFeatures){
        this._subscriptionFeature = subscriptionFeature;
    }

    public GetSubscribers = async (request: Request<{}, {}, {}, PaginatedQueryParamsRequest>, response: Response, next: NextFunction) => {
        try{
            const {page, pageSize} = new PaginatedQueryParamsRequest(request.query.page, request.query.pageSize);
            const pagedSubscriberResponse = await this._subscriptionFeature.GetAllSubscribers({page, pageSize});
            return response.status(200).json(pagedSubscriberResponse);
        }
        catch(ex){
            next(ex);
        }
    }

    public AddSubscriber = async (request: Request<{}, {}, AddSubscriberRequest, {}>, response: Response, next: NextFunction) => {
        try{
            const addedSubscriber: Subscriber = await this._subscriptionFeature.AddSubscriber(request.body);
            // send subscriber welecome message
            const welcomeMessage = "Hi player. Thank you for subscribing to Quizly AI! Rest assured, you will only receive messages from us when a new quiz goes live. \nStay tuned for exciting quizzes and challenges!";
            await this._subscriptionFeature.MessageSubscriber(addedSubscriber, welcomeMessage) // no need to await response

            return response.status(201).json(addedSubscriber);
        }
        catch(ex){
            next(ex)
        }
    }

    public DeleteSubscriber = async (request: Request<{}, {}, {}, QuizByIdQueryParam>, response: Response, next: NextFunction) => {
        try{
            const id = request.query.id
            await this._subscriptionFeature.DeleteSubscriber(id);
            return response.sendStatus(204)
        }
        catch(ex){
            next(ex);
        }
    }

    
}