import { User } from "../../../Domain/Entities/AuthenticationModule/User";
import { IUserRepository } from "../../../Application/Contracts/DataAccess/AuthenticationDataAccess/IUserRepository";
import { IUserService } from "../../../Application/Contracts/Services/AuthenticationServiceModule/IUserService";
import { Authentication } from "../../../Domain/Entities/AuthenticationModule/Aggregates/Authentication";
import { RandomUtilities } from "../../Common/Utilities/RandomUtilities";
import { HashConfig } from "../../../Application/Common/Config/HashConfig";
import { EncryptionUtilities } from "../../../Application/Common/Utilities/EncryptionUtiltities";
import { RecordStatus } from "../../../Domain/Enums/Common/RecordStatus";
import { UserRole } from "../../../Domain/Enums/AuthenticationModule/UserRole";
import { UserNotFoundException } from "../../../Application/Common/Exceptions/UserNotFoundException";
import { ObjectId } from "mongoose";

export class UserService implements IUserService{
    private readonly _userRepository: IUserRepository;
    private readonly _hashConfig: HashConfig;

    public constructor(userRepository: IUserRepository, hashConfig: HashConfig){
        this._userRepository = userRepository;
        this._hashConfig = hashConfig;
    }
    public doesUserWithEmailExist = async (email: string): Promise<boolean> => {
        const user: User | null = await this._userRepository.getUserByEmail(email);
        return user != null; 
    }

    public generateAuthenticationForPassword = (password: string): Authentication => {
        const BYTE_SIZE = 128;
        const authentication = new Authentication();

        // generate random salt
        authentication.salt = RandomUtilities.GenerateByteString(BYTE_SIZE);
        // add alt and password together, then hash
        const passwordSaltHash = this.hashPasswordAndSalt(password, authentication.salt)

        authentication.password = passwordSaltHash;

        return authentication;
    }

    public hasValidAuthenticationCredentials = (user: User, password: string): boolean => {
        // get salt from user
        const savedSalt: string = user.authentication.salt;
        const hashedPasswordAndSalt: string = this.hashPasswordAndSalt(password, savedSalt);
        return hashedPasswordAndSalt === user.authentication.password;
    }

    public getUserByEmail = async (email: string): Promise<User | null> => {
        const user: User | null = await this._userRepository.getUserByEmail(email);
        return user; 
    }
    public hashPasswordAndSalt = (password: string, salt: string): string => {
        const saltPasswordString = `${password}/${salt}`;
        const passwordSaltHash = EncryptionUtilities.HashString(saltPasswordString, this._hashConfig.HASH_SECRET);
        return passwordSaltHash;
    }

    public GetAllUsers = async (): Promise<User[]> => {
        return await this._userRepository.GetAsync({ recordStatus: RecordStatus.active });
    }

    public SaveUser = async (user: User): Promise<User> => {
        return await this._userRepository.AddAsync(user);
    }

    public UpdateUserRoleToAdmin = (user: User): User => {
        user.userRole = UserRole.admin;
        user.isAdmin = true;
        return user;
    }

    public FindUserByEmailAndUpdatePassword = async (email: string, password: string): Promise<User> => {
         // find user by email
         const user: User | null = await this.getUserByEmail(email);
         if(!user ){
             throw new UserNotFoundException(`user with email ${email} not found`);
         }
 
         // update user password;
         return await this.UpdateAndSaveUserPassword(user, password);
    }

    public UpdateUser = async (user: User): Promise<User> => {
        return await this._userRepository.UpdateAsync(user);
    }

    public UpdateAndSaveUserPassword = async (user: User, password: string): Promise<User> => {
        const generatedAuth: Authentication = this.generateAuthenticationForPassword(password);

        // change necessar
        user.authentication.password = generatedAuth.password;
        user.authentication.salt = generatedAuth.salt;

        return await this._userRepository.UpdateAsync(user);
    }

    public DeleteUserById = async (id: ObjectId): Promise<void> => {
        const entity =await this._userRepository.GetByIdAsync(id);
        if(entity){
            await this._userRepository.DeleteAsync(entity, true);
        }
    }
}