import { RegisterUserRequest } from 'Application/DTO/Requests/AuthenticationRequests/RegisterUserRequest';
import { AsyncValidator } from 'fluentvalidation-ts';

export class RegisterUserRequestValidator extends AsyncValidator<RegisterUserRequest> {
    public constructor(){
        super();
        this.ruleFor('email')
            .emailAddress()
            .withMessage("Please use a valid email address");
        this.ruleFor('password')
            .notEmpty()
            .minLength(5)
            .withMessage("Password must be at least 5characters long");

    }

    
}