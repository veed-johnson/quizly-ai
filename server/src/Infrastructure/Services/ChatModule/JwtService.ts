import { JwtConfig } from "../../../Infrastructure/Config/JwtConfig";
import { TimeUnit } from "../../../Application/Common/ApplicationEnums/TimeUnit";
import {JwtPayload, sign, verify} from 'jsonwebtoken';
import { IAuthService } from "../../../Application/Contracts/Services/AuthenticationServiceModule/IAuthService";
import { DateAndTimeUtilities } from "../../../Application/Common/Utilities/DateAndTimeUtilities";

export class JwtService implements IAuthService{
    private readonly _jwtConfig: JwtConfig;
    public constructor(jwtConfig: JwtConfig){
        this._jwtConfig = jwtConfig;
    }

    public generateToken = async (claims: {[k: string]: any}, duration: number, timeUnit: TimeUnit): Promise<string> => {

        const timeInSeconds = DateAndTimeUtilities.ConvertTimeToSeconds(duration, timeUnit)
        return sign(claims, this._jwtConfig.JWT_KEY, {
            expiresIn: timeInSeconds
        });
    }

    public verifyToken = async (token: string): Promise<{[k: string]: any} | null> => {

        try{
            return verify(token, this._jwtConfig.JWT_KEY) as JwtPayload;
        }
        catch(ex){
            return null;
        }
    }


}