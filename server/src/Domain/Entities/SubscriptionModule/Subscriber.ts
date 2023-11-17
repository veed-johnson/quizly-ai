import { ObjectId } from "mongoose";
import { BaseEntity } from "../Common/BaseEntity";

export class Subscriber extends BaseEntity<ObjectId>{
    countryCode: string;
    phoneNumber: string;
}