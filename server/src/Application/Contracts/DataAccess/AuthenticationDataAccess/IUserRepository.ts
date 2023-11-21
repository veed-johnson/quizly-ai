import { IBaseRepository } from "../Common/IBaseRepository";
import { ObjectId } from "mongoose";
import { User } from "../../../../Domain/Entities/AuthenticationModule/User";

export interface IUserRepository extends IBaseRepository<User, ObjectId> {
    getUserByEmail(email: string): Promise<User | null>;
}