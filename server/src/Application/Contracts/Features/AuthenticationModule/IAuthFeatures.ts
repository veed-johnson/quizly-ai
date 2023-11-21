import { ResetPasswordTokenRequest } from "../../../../Application/DTO/Requests/AuthenticationRequests/ResetPasswordTokenRequest";
import { LoginUserRequest } from "../../../../Application/DTO/Requests/AuthenticationRequests/LoginUserRequest";
import { User } from "../../../../Domain/Entities/AuthenticationModule/User";
import { ResetPasswordRequest } from "../../../../Application/DTO/Requests/AuthenticationRequests/ResetPasswordRequest";

export interface IAuthFeatures {
    GetTokenForUser(user: User): Promise<string>;
    LoginUser (loginUserRequest: LoginUserRequest): Promise<User>
    GenerateAndSendResetPasswordToken(resetPasswordTokenRequest: ResetPasswordTokenRequest): Promise<void>;
    ResetPassword(resetPasswordRequest: ResetPasswordRequest) : Promise<User>;
    isUserWithTokenAdmin(token?: string): Promise<boolean>;
}