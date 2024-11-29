import  { model, Schema } from "mongoose";

 export interface IUserOtp {
    save(): unknown;
    otp: string;
    email: string;
    verified: boolean
    expirationTime: Date;
    createdAt: Date;
 }

  const UserOtpSchema = new Schema<IUserOtp>({
    email: {
        type: String,
        required: true,
        //unique: true
        //Removed the unique constraint to avoid duplicate key error
    },

    otp:  {
        type: String,
        required: true,
    },

    verified:  {
        type: Boolean,
        default: false
    },

    expirationTime:  {
        type: Date,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true
    },
         
 });

 
 export const UserOtp = model<IUserOtp>('UserOtps', UserOtpSchema)