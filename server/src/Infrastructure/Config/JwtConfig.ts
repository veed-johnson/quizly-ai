export class JwtConfig {
    public JWT_KEY: string;

    public constructor(jwtKey: string){
        this.JWT_KEY = jwtKey;
    }
}