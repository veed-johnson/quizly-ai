import { TimeUnit } from "../../../../Application/Common/ApplicationEnums/TimeUnit";
export interface IAuthService {
    generateToken(claims: {[k: string]: any}, duration: number, timeUnit: TimeUnit): Promise<string>;
    verifyToken(token: string): Promise<{[k: string]: any} | null>

}