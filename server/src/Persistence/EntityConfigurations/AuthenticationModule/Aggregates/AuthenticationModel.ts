import { Authentication } from "Domain/Entities/AuthenticationModule/Aggregates/Authentication";
import { Schema } from "mongoose";

export const AuthenticationSchema = new Schema<Authentication>({
    password: {type: String, required: true},
    salt: {type: String, default: ""}
})