export class SiteConfig {
    AUTH_COOKIE: string;
    SITE_BASE_URL: string;
    SITE_BASE_PATH: string;
    FRONT_END_BASEURL: string;
    FRONT_END_RESET_PASSWORD_URL: string;

    public constructor(AUTH_COOKIE: string, SITE_BASE_URL: string, SITE_BASE_PATH: string, FRONT_END_BASEURL: string, FRONT_END_RESET_PASSWORD_URL: string ){
        this.AUTH_COOKIE = AUTH_COOKIE;
        this.SITE_BASE_URL = SITE_BASE_URL;
        this.SITE_BASE_PATH = SITE_BASE_PATH;
        this.FRONT_END_BASEURL = FRONT_END_BASEURL;
        this.FRONT_END_RESET_PASSWORD_URL = FRONT_END_RESET_PASSWORD_URL;
    }
}