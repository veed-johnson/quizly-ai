import crypto from "crypto";

export class RandomUtilities{
    public static GenerateByteString = (size: number): string => {
       return crypto.randomBytes(size).toString("base64");
    }
}