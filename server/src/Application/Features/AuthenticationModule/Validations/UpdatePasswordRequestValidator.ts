import { UpdatePasswordRequest } from "../../../../Application/DTO/Requests/AuthenticationRequests/UpdatePasswordRequest"
import { AsyncValidator } from "fluentvalidation-ts"

export class UpdatePasswordRequestValidator extends AsyncValidator<UpdatePasswordRequest>{
    public constructor(){
        super();
        this.ruleFor('email')
            .emailAddress()
            .withMessage("Please use a valid email address");
        this.ruleFor('newPassword')
            .notEmpty()
            .minLength(5)
            .withMessage("Password must be at least 5characters long");
    }
}