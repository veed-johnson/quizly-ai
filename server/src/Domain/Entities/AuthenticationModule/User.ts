import { ObjectId } from "mongoose";
import { BaseEntity } from "../Common/BaseEntity";
import { Authentication } from "./Aggregates/Authentication";
import { UserRole } from "../../../Domain/Enums/AuthenticationModule/UserRole";

export class User extends BaseEntity<ObjectId> {
    public email: string;
    public authentication: Authentication;
    public userRole: UserRole;
    public isAdmin: boolean;
    public constructor(email: string, authentication: Authentication, userRole: UserRole = UserRole.user ){
        super();
        this.email = email;
        this.authentication = authentication;
        this.userRole = userRole;
        this.isAdmin = this.userRole === UserRole.admin;
    }
}