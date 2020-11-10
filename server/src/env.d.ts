declare namespace NodeJS {
  export interface ProcessEnv {
    HOSTNAME : string;
    URL : string;
    DATABASE : string;
    USERNAME : string;
    PASSWORD : string;
    SECRET : string;
    PORT : string;
    CORS_ORIGIN : string;
  }
}
