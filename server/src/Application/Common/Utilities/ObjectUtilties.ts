export class ObjectUtilities {
    public static IsEmptyObject = (object: {[key: string]: any}): boolean => {
        return Object.keys(object).length === 0;
    }
}