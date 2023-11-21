import { User } from "../../../Domain/Entities/AuthenticationModule/User";
import { IAuthService } from "../../../Application/Contracts/Services/AuthenticationServiceModule/IAuthService";
import { TimeUnit } from "../../../Application/Common/ApplicationEnums/TimeUnit";
import { IAuthFeatures } from "../../../Application/Contracts/Features/AuthenticationModule/IAuthFeatures";
import { IUserService } from "../../../Application/Contracts/Services/AuthenticationServiceModule/IUserService";
import { LoginUserRequest } from "../../../Application/DTO/Requests/AuthenticationRequests/LoginUserRequest";
import { UserNotFoundException } from "../../../Application/Common/Exceptions/UserNotFoundException";
import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";
import { AuthenticationException } from "../../../Application/Common/Exceptions/AuthenticationException";
import { ResetPasswordTokenRequest } from "Application/DTO/Requests/AuthenticationRequests/ResetPasswordTokenRequest";
import { ILoginUserClaim } from "./Models/ILoginUserClaim";
import { IResetPasswordClaim } from "./Models/IResetPasswordClaim";
import { IMailService } from "../../../Application/Contracts/Services/ChatModule/IMailService";
import { EmailType } from "../../../Application/Common/ApplicationEnums/EmailType";
import { ResetPasswordRequest } from "../../../Application/DTO/Requests/AuthenticationRequests/ResetPasswordRequest";

export class AuthFeatures implements IAuthFeatures{
    private readonly _authService: IAuthService;
    private readonly _userService: IUserService;
    private readonly _mailService: IMailService
    public constructor( authService: IAuthService, userService: IUserService, mailService: IMailService){
        this._authService = authService;
        this._userService = userService;
        this._mailService = mailService;
    }

    LoginUser = async (loginUserRequest: LoginUserRequest): Promise<User> => {
        // get user by email
        const {email, password} = loginUserRequest;
        const user = await this._userService.getUserByEmail(email);
        if(!user){
            throw new UserNotFoundException(`User with email address: ${email} not found`);
        }
        // check if user is active
        if(user.recordStatus != RecordStatus.active){
            throw new UserNotFoundException(`User with email address: ${email} is no longer active`);
        }

        // compare user details against stored hash
        const userHasValidCredentitals = this._userService.hasValidAuthenticationCredentials(user, password);
        if(!userHasValidCredentitals){
            throw new AuthenticationException(`Invalid email or password`)
        }

        return user;
    }

    public GetTokenForUser = async (user: User): Promise<string> => {
        // get data we need to encrypt
        const TOKEN_VALIDITY_PERIOD = 7;
        const TIME_UNIT_OF_VALIDITY_PERIOD = TimeUnit.day;
        const claims: ILoginUserClaim = {
            email: user.email,
            id: user._id,
            role: user.userRole,
            isAdmin: user.isAdmin
        }
        // encrypt selected data
        return await this._authService.generateToken(claims, TOKEN_VALIDITY_PERIOD, TIME_UNIT_OF_VALIDITY_PERIOD);
    }

    public GenerateAndSendResetPasswordToken = async (resetPasswordTokenRequest: ResetPasswordTokenRequest): Promise<void> => {
        // check if user exists
        const {email, resetPasswordUrl} = resetPasswordTokenRequest;
        const doesUserWithEmailExist: boolean = await this._userService.doesUserWithEmailExist(email);
        if(!doesUserWithEmailExist){
            return;
        }

        // if yes generate token for reset password
        const TOKEN_VALIDITY_PERIOD = 30;
        const TIME_UNIT_OF_VALIDITY_PERIOD = TimeUnit.minute;
        const resetPasswordClaims: IResetPasswordClaim = {
            email: email
        };
        const token = await this._authService.generateToken(resetPasswordClaims, TOKEN_VALIDITY_PERIOD, TIME_UNIT_OF_VALIDITY_PERIOD);

        // include generated token in base url param
        const link: string = `${resetPasswordUrl}/?token=${token}`;
        const title = "Reset Password";
        const body = `Please click on the link to reset your password: ${link}`
        // send email to user
        await this._mailService.sendMail(email, title, body, EmailType.html);
    }

    public ResetPassword = async (resetPasswordRequest: ResetPasswordRequest) : Promise<User> => {
        // validate token
        // TODO: Add validation password
        const {token, newPassword} = resetPasswordRequest;
        const resetPasswordClaim: IResetPasswordClaim | null = await this._authService.verifyToken(token) as IResetPasswordClaim | null;
        if(!resetPasswordClaim ){
            throw new AuthenticationException(`Invalid token`);
        }

        // get email from token
        const { email } = resetPasswordClaim;
        // find user by email and update user password;
        return await this._userService.FindUserByEmailAndUpdatePassword(email, newPassword);
    }

    public isUserWithTokenAdmin = async (token?: string): Promise<boolean> => {
        if(!token){
            return false;
        }
        const loggedInUserClaim: ILoginUserClaim | null = await this._authService.verifyToken(token) as  ILoginUserClaim | null;
        console.log({loggedInUserClaim})
        if(!loggedInUserClaim){
            return false;
        }
        return loggedInUserClaim.isAdmin;
    }
    
}