import { ObjectId } from "mongoose";

export class Authentication {
    public _id: ObjectId | string
    public password: string;
    public salt: string;
}