import { Authentication } from "../../../Domain/Entities/AuthenticationModule/Aggregates/Authentication";
import { User } from "../../../Domain/Entities/AuthenticationModule/User";
import { Schema, model } from "mongoose";
import { AuthenticationSchema } from "./Aggregates/AuthenticationModel";


const UserSchema = new Schema<User>({
    createdAt: { type: Date, required: true },
    updatedAt : { type: Date, required: true },
    recordStatus: {type: String, required: true},
    
    email: {type: String, required: true},
    authentication: {type: AuthenticationSchema, required: true},
    userRole: {type: String, required: true},
    isAdmin: {type: Boolean, required: true}
});

export const UserModel = model<User>("AppUser", UserSchema);