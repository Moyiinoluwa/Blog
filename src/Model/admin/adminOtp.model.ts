import { model, Schema } from "mongoose";

export interface IAdminOtp {
    save(): unknown;
    otp: string;
    email: string;
    verified: boolean
    expirationTime: Date;
    createdAt: Date;
}


const AdminOtpSchema = new Schema<IAdminOtp>({
    email: {
        type: String,
        required: true,
        //unique: true
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

export const AdminOtp = model<IAdminOtp>('AdminOtp', AdminOtpSchema)