export class BaseException  extends Error{
    public errors: {[key: string]: any} | null;
    public message: string;
    
    public constructor(message: string, errors: {[key: string]: any} | null = {}){
        super(message);
        this.errors = errors;
    }
}