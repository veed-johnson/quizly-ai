import { ObjectId } from "mongoose";
import { User } from "../../../Domain/Entities/AuthenticationModule/User";
import { BaseRepository } from "../Common/BaseRepository";
import { IUserRepository } from "../../../Application/Contracts/DataAccess/AuthenticationDataAccess/IUserRepository";
import { UserModel } from "../../../Persistence/EntityConfigurations/AuthenticationModule/UserModel";

export class UserRepository extends BaseRepository<User, ObjectId> implements IUserRepository{
    public constructor(){
        super(UserModel)
    }
    getUserByEmail = async (email: string): Promise<User | null> => {
        const query = {email: email}
        return await this.FirstOrDefault(query);
    }
    
}