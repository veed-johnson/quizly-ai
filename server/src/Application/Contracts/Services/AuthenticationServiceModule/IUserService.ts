import { User } from "../../../../Domain/Entities/AuthenticationModule/User";
import { Authentication } from "../../../../Domain/Entities/AuthenticationModule/Aggregates/Authentication";
import { ObjectId } from "mongoose";

export interface IUserService{
    doesUserWithEmailExist(email: string): Promise<boolean>;
    generateAuthenticationForPassword(password: string): Authentication;
    SaveUser(user: User): Promise<User>;
    hashPasswordAndSalt(password: string, salt: string): string;
    getUserByEmail(email: string): Promise<User | null>;
    hasValidAuthenticationCredentials(user: User, password: string): boolean;
    GetAllUsers(): Promise<User[]>;
    UpdateUserRoleToAdmin(user: User): User;
    UpdateUser(user: User): Promise<User>;
    UpdateAndSaveUserPassword(user: User, password: string): Promise<User>;
    FindUserByEmailAndUpdatePassword(email: string, password: string): Promise<User>;
    DeleteUserById (id: ObjectId): Promise<void> 

}