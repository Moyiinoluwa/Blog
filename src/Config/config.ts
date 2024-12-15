import { Config } from "../Types/config";

export const getConfig = (): Config => {

    //required variables to start the app
    const required: string[] = [ 'DB_URI', 'PORT'];

    //for each loops through the required variable to check if the variable exists, if the variable does not exists, it throws an error
     required.forEach((variable: string) => {
        if(!process.env[variable]) throw new Error(`${variable} env not set`)
     });

    return {
        DB_URI: process.env.DB_URI as string,
        PORT: Number(process.env.PORT) || 3000,
        AUTH_EMAIL: process.env.AUTH_EMAIL as string,
        AUTH_PASSWORD: process.env.AUTH_PASSWORD as string,
        SECRET_KEY: process.env.SECRET_KEY as string,
        EXPIRES_IN: process.env.EXPIRES_IN || '1yr'

    }

};

export default getConfig();
