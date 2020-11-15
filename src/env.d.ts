declare namespace NodeJS {
  export interface ProcessEnv {
    HOSTNAME : string;
    URL : string;
    DATABASE : string;
    USERNAME : string;
    PASSWORD : string;
    SECRET : string;
    PORT : string;
    HEROKU_PORT : string;
    CORS_ORIGIN : string;
    REDIS_PORT : string;
    REDIS_HOST : string;
    REDIS_PASSWORD : string;
    GK_MAIL : string;
    GK_PASSWORD : string;
    SECRET_KEY : string;
  }
}
