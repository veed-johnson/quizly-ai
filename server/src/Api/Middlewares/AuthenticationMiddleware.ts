import { NextFunction, Request, Response } from "express";
import { SiteConfig } from "../../Api/Common/Config/SiteConfig";
import { IAuthFeatures } from "../../Application/Contracts/Features/AuthenticationModule/IAuthFeatures";
import { appSettings } from "../../Api/appSettings";
import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";

const siteConfig = new SiteConfig(appSettings.AUTH_COOKIE, appSettings.SITE_BASE_URL, appSettings.SITE_BASE_PATH);


/**
 * route {authentication}
 */
export class AuthenticationMiddleware {
    private readonly _authFeatures: IAuthFeatures;
    private readonly _siteConfig: SiteConfig;

    public constructor(authFeatures: IAuthFeatures, siteConfig: SiteConfig){
      
        this._authFeatures = authFeatures;
        this._siteConfig = siteConfig;
    }

    public adminPermissionRequired = async (request: Request<Request>, response: Response, next: NextFunction) => {
        const cookieKey = this._siteConfig.AUTH_COOKIE;
        const token = request.cookies[cookieKey];
        if(!token){
            response.sendStatus(403);
            return;
        }

        const isUserWithTokenAdmin = await this._authFeatures.isUserWithTokenAdmin(token);
        console.log({isUserWithTokenAdmin})
        if(!isUserWithTokenAdmin){
            response.sendStatus(403);
            return;
        }
         next();
    }
}

export const authenticationMiddleware = new AuthenticationMiddleware(applicationFeatureFactory.AuthFeatures(), siteConfig);