import { NextFunction, Request, Response } from "express";
import { RegisterUserRequest } from "../../Application/DTO/Requests/AuthenticationRequests/RegisterUserRequest";
import { IUserFeatures } from "../../Application/Contracts/Features/AuthenticationModule/IUserFeatures";
import { LoginUserRequest } from "../../Application/DTO/Requests/AuthenticationRequests/LoginUserRequest";
import { SiteConfig } from "../../Api/Common/Config/SiteConfig";
import { IAuthFeatures } from "../../Application/Contracts/Features/AuthenticationModule/IAuthFeatures";
import { ResetPasswordTokenRequest } from "../../Application/DTO/Requests/AuthenticationRequests/ResetPasswordTokenRequest";
import { ResetPasswordRequest } from "../../Application/DTO/Requests/AuthenticationRequests/ResetPasswordRequest";

/**
 * route {authentication}
 */
export class AuthenticationController {
    private readonly _userFeatures: IUserFeatures;
    private readonly _authFeatures: IAuthFeatures;
    private readonly _siteConfig: SiteConfig;

    public constructor(userFeatures: IUserFeatures, authFeatures: IAuthFeatures, siteConfig: SiteConfig){
        this._userFeatures = userFeatures;
        this._authFeatures = authFeatures;
        this._siteConfig = siteConfig;
    }

    /**
     * @route 'register
     * @param request 
     * @param response 
     * @returns 
     */
    public Register = async (request: Request<{}, {}, RegisterUserRequest>, response: Response, next: NextFunction): Promise<Response> => {
        try{
            const registeredUser = await this._userFeatures.RegisterUser(request.body);
            return response.status(200).json(registeredUser);
        }
        catch(ex){
            next(ex);
        }
    }

    /**
     * @route 'login
     * @param request 
     * @param response 
     * @returns 
     */
    public Login = async (request: Request<{}, {}, LoginUserRequest>, response: Response, next: NextFunction) => {
        try{
            const loginUser = await this._authFeatures.LoginUser(request.body);

            const token = await this._authFeatures.GetTokenForUser(loginUser);
            // add token to cookie
            response.cookie(this._siteConfig.AUTH_COOKIE, token, {
                domain: this._siteConfig.SITE_BASE_URL,
                path: this._siteConfig.SITE_BASE_PATH
            });

            return response.status(200).json(loginUser);
        }
        catch(ex){
            next(ex);
        }
    }

    public GenerateAndSendResetPasswordToken = async (request: Request<{}, {}, ResetPasswordTokenRequest>, response: Response, next: NextFunction) => {
        try{
            const resetPasswordTokenRequest: ResetPasswordTokenRequest = request.body;
            resetPasswordTokenRequest.resetPasswordUrl = this.GetBaseUrl(request);
            await this._authFeatures.GenerateAndSendResetPasswordToken(request.body);

            return response.sendStatus(200);
        }
        catch(ex){
            next(ex);
        }
    }

    public ResetPassword = async (request: Request<{}, {}, ResetPasswordRequest>, response: Response, next: NextFunction) => {
        try{
            const userWithPasswordReset  = await this._authFeatures.ResetPassword(request.body);
            return response.status(200).json(userWithPasswordReset);
        }
        catch(ex){
            next(ex);
        }
    }

    private GetBaseUrl = (req: Request): string => {
        const protocol = req.protocol; 
        const host = req.hostname; 
        const port = process.env.PORT; 
  
        const baseUrl = `${protocol}://${host}:${port}` 
        return baseUrl;
    }
}