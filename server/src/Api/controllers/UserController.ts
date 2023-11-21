import { MakeUserAdminRequest } from "../../Application/DTO/Requests/AuthenticationRequests/MakeUserAdminRequest";
import { IUserFeatures } from "../../Application/Contracts/Features/AuthenticationModule/IUserFeatures";
import { Request, Response, NextFunction } from "express";
import { UpdatePasswordRequest } from "../../Application/DTO/Requests/AuthenticationRequests/UpdatePasswordRequest";
import { UserIdParam } from "../../Application/DTO/Requests/AuthenticationRequests/UserIdParam";
/**
 * route user
 */
export class UserController {
    private readonly _userFeatures: IUserFeatures;

    public constructor(userFeatures: IUserFeatures){
        this._userFeatures = userFeatures;
    }

    /**
     * @route 'createadmin
     * @param request 
     * @param response 
     * @returns 
     */
    public CreateAdmin = async (request: Request<{}, {}, MakeUserAdminRequest>, response: Response, next: NextFunction) => {
        try{
            
            const userAdmin = await this._userFeatures.MakeUserAdmin(request.body);
            return response.status(200).json(userAdmin);
        }
        catch(ex){
            next(ex);
        }
    }

    /**
     * 
     */
    public UpdateUserPassword = async (request: Request<{}, {}, UpdatePasswordRequest>, response: Response, next: NextFunction) => {
        try{
            const userWithUpdatedPassword = await this._userFeatures.UpdateUserPassword(request.body);
            return response.status(200).json(userWithUpdatedPassword);
        }
        catch(ex){
            next(ex)
        }
    }


    /**
     * 
     * @param request 
     * @param response 
     * @param next 
     * @returns list of Users (Not a paginated view)
     */
    public GetAllUsers = async (request: Request, response: Response, next: NextFunction) => {
        
        try{
            const allUsers = await this._userFeatures.GetAllUsers()
            return response.status(200).json(allUsers);
        }
        catch(ex){
            next(ex)
        }
    }

    public DeleteUser = async (request: Request<UserIdParam, {}, {}, {}>, response: Response, next: NextFunction) => {
        try{
            const {id} = request.params;
            await this._userFeatures.DeleteUser(id);
            return response.status(200).json({});
        }
        catch(ex){
            next(ex)
        }
    }
}