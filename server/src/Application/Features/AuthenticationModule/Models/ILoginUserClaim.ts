import { ObjectId } from "mongoose";

export interface ILoginUserClaim {
    
        email: string,
        id: string | ObjectId,
        role: string,
        isAdmin: boolean
    
}