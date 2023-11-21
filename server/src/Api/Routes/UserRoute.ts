import { SiteConfig } from "../../Api/Common/Config/SiteConfig";
import { appSettings } from "../../Api/appSettings";
import { applicationFeatureFactory } from "../Factories/ApplicationFeatureFactory";
import { Router } from "express";
import { UserController } from "../../Api/Controllers/UserController";
import { authenticationMiddleware } from "../../Api/Middlewares/AuthenticationMiddleware";

export const userController = new UserController(applicationFeatureFactory.UserFeatures());

const UserRoute = Router();

UserRoute.post("/createadmin", authenticationMiddleware.adminPermissionRequired,  userController.CreateAdmin);
UserRoute.post("/updatepassword", userController.UpdateUserPassword);
UserRoute.get("/allusers", userController.GetAllUsers);
UserRoute.delete("/delete/:id", userController.DeleteUser);
export {UserRoute};