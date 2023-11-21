import { createHmac } from "crypto"
export class EncryptionUtilities {
    
    public static HashString = (chars: string, secret: string ): string => {
        const ALGORITHM = "sha256";
        const HEX = 'hex';
        return createHmac(ALGORITHM, secret)
            .update(chars)
            .digest(HEX);
    }
}