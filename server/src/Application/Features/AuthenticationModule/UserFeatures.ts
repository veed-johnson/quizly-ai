import { User } from "../../../Domain/Entities/AuthenticationModule/User";
import { RegisterUserRequest } from "../../../Application/DTO/Requests/AuthenticationRequests/RegisterUserRequest";
import { IUserService } from "../../../Application/Contracts/Services/AuthenticationServiceModule/IUserService";
import { RegisterUserRequestValidator } from "./Validations/RegisterUserRequestValidator";
import { ObjectUtilities } from "../../Common/Utilities/ObjectUtilties";
import { ValidationException } from "../../../Application/Common/Exceptions/ValidationException";
import { DuplicateException } from "../../../Application/Common/Exceptions/DuplicateException";
import { Authentication } from "../../../Domain/Entities/AuthenticationModule/Aggregates/Authentication";
import { IUserFeatures } from "../../../Application/Contracts/Features/AuthenticationModule/IUserFeatures";
import { UserNotFoundException } from "../../../Application/Common/Exceptions/UserNotFoundException";
import { AuthenticationException } from "../../../Application/Common/Exceptions/AuthenticationException";
import { MakeUserAdminRequest } from "../../../Application/DTO/Requests/AuthenticationRequests/MakeUserAdminRequest";
import { UpdatePasswordRequest } from "../../../Application/DTO/Requests/AuthenticationRequests/UpdatePasswordRequest";
import { UpdatePasswordRequestValidator } from "./Validations/UpdatePasswordRequestValidator";
import { ObjectId, mongo } from "mongoose";

export class UserFeatures implements IUserFeatures{
    private readonly _userService: IUserService;
    public constructor(userService: IUserService){
        this._userService = userService;
    }

    public RegisterUser = async (registerUserDTO: RegisterUserRequest): Promise<User> => {

        const registerUserRequestValidator = new RegisterUserRequestValidator();
        const validationResult = await registerUserRequestValidator.validateAsync(registerUserDTO);
        if(!ObjectUtilities.IsEmptyObject(validationResult)){
            throw new ValidationException("RegisterUser: Validation errors", validationResult);
        }

        const doesUserWithEmailExist: boolean = await this._userService.doesUserWithEmailExist(registerUserDTO.email);
        if(doesUserWithEmailExist){
            throw new DuplicateException("RegisterUser: Duplicate error. User with email already exists");
        }
        
        // create Authentication for User with salt and hashed password
        const authenticationForUser: Authentication = this._userService.generateAuthenticationForPassword(registerUserDTO.password);
        const user: User = new User(registerUserDTO.email, authenticationForUser);

        return await this._userService.SaveUser(user);
    }

    public GetAllUsers = async (): Promise<User[]> => {
        // get all users 
        return await this._userService.GetAllUsers();
    }

    public MakeUserAdmin = async (makeUserAdminRequest: MakeUserAdminRequest): Promise<User> => {
        const user: User = await this._userService.getUserByEmail(makeUserAdminRequest.email);
        if(!user){
            throw new UserNotFoundException("User with email not found");
        }

        const updatedUser: User = this._userService.UpdateUserRoleToAdmin(user);
        return await this._userService.UpdateUser(updatedUser);

    }

    public UpdateUserPassword = async (updatePasswordRequest: UpdatePasswordRequest): Promise<User> => {
        // validate updatePasswordRequest
        const updateRequestValidator = new UpdatePasswordRequestValidator();
        const validationResult = await updateRequestValidator.validateAsync(updatePasswordRequest);
        if(!ObjectUtilities.IsEmptyObject(validationResult)){
            throw new ValidationException("UpdatePassword Validation Error: There was an error updating password", validationResult);
        }
        
        const {email, oldPassword, newPassword} = updatePasswordRequest;
        // get user by email
        const user = await this._userService.getUserByEmail(email)
        if(!user){
            throw new UserNotFoundException(`User with email ${email} not found`);
        }
        // validate old password is valid
        const userHasValidCredentials = this._userService.hasValidAuthenticationCredentials(user, oldPassword);
        if(!userHasValidCredentials){
            throw new AuthenticationException(`Invalid credentials`);
        }
        // update password to new password
        const userWithUpdatedPassword = await this._userService.UpdateAndSaveUserPassword(user, newPassword);

        return userWithUpdatedPassword;
        
    }

    public DeleteUser = async (id: string): Promise<void> => {
        const objectId: ObjectId = new mongo.ObjectId(id) as unknown as ObjectId;
        await this._userService.DeleteUserById(objectId);
        return ;
    }

    public GetAllAdminUsers = async (): Promise<User[]> => {
        const allUsers: User[] = await this.GetAllUsers();
        return allUsers.filter(user => user.isAdmin);
    }

    
}