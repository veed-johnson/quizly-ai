import { SiteConfig } from "../../Api/Common/Config/SiteConfig";
import { appSettings } from "../../Api/appSettings";
import { AuthenticationController } from "../../Api/Controllers/AuthenticationController";
import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";
import { Router } from "express";

const siteConfig = new SiteConfig(appSettings.AUTH_COOKIE, 
    appSettings.SITE_BASE_URL, 
    appSettings.SITE_BASE_PATH, 
    appSettings.FRONT_END_BASEURL, 
    appSettings.FRONT_END_RESET_PASSWORD_URL)

export const authenticationController = new AuthenticationController(applicationFeatureFactory.UserFeatures(), applicationFeatureFactory.AuthFeatures(), siteConfig);

const AuthenticationRoute = Router();

AuthenticationRoute.post("/register", authenticationController.Register);
AuthenticationRoute.post('/login', authenticationController.Login);
AuthenticationRoute.post('/sendresetpasswordtoken', authenticationController.GenerateAndSendResetPasswordToken);
AuthenticationRoute.post('/resetpassword', authenticationController.ResetPassword);
export {AuthenticationRoute};