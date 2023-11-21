import { MakeUserAdminRequest } from "../../../../Application/DTO/Requests/AuthenticationRequests/MakeUserAdminRequest";
import { LoginUserRequest } from "../../../../Application/DTO/Requests/AuthenticationRequests/LoginUserRequest";
import { RegisterUserRequest } from "../../../../Application/DTO/Requests/AuthenticationRequests/RegisterUserRequest";
import { User } from "../../../../Domain/Entities/AuthenticationModule/User";
import { UpdatePasswordRequest } from "../../../../Application/DTO/Requests/AuthenticationRequests/UpdatePasswordRequest";

export interface IUserFeatures {
    RegisterUser(registerUserDTO: RegisterUserRequest): Promise<User>;
    
    GetAllUsers(): Promise<User[]>
    MakeUserAdmin(makeUserAdminRequest: MakeUserAdminRequest): Promise<User>

    UpdateUserPassword (updatePasswordRequest: UpdatePasswordRequest): Promise<User>;

    DeleteUser(id: string): Promise<void>

    GetAllAdminUsers(): Promise<User[]>
}