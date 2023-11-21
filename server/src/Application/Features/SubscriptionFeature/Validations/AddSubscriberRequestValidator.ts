import { AddSubscriberRequest } from "../../../../Application/DTO/Requests/SubscriberRequests/AddSubscriberRequest";
import { AsyncValidator } from "fluentvalidation-ts";

export class AddSubscriberRequestValidator extends AsyncValidator<AddSubscriberRequest>{
    public constructor(){
        super();
        this.ruleFor('countryCode')
            .notEmpty()
            .withMessage("countryCode must not be empty");
        
        this.ruleFor('phoneNumber')
            .notEmpty()
            .withMessage("phoneNumber should not be empty");
    }
}