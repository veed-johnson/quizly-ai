export class SiteConfig {
    AUTH_COOKIE: string;
    SITE_BASE_URL: string;
    SITE_BASE_PATH: string;
    public constructor(AUTH_COOKIE: string, SITE_BASE_URL: string, SITE_BASE_PATH: string){
        this.AUTH_COOKIE = AUTH_COOKIE;
        this.SITE_BASE_URL = SITE_BASE_URL;
        this.SITE_BASE_PATH = SITE_BASE_PATH;
    }
}