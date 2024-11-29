import { model, Schema } from "mongoose";
import { Role } from "../../Modules/Enum/enum.role";

export interface IUser {
    save(): unknown;
    deleteOne(): unknown; 
   // deleteOne(arg0: { id: string; }): unknown;
   // save(): unknown;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date
    resetLink: String;
    resetLink_expirationTime: Date;
    isResetLinkSent: Boolean;
    isVerified: Boolean;
    isLocked: Boolean;
    loginCount: Number;
    role: Role
}


const UserSchema = new Schema<IUser>({
    firstName : {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: false
    },

    resetLink: {
        type: String,
        
    },

    isResetLinkSent: {
        type: Boolean,
        default: false
    },

    resetLink_expirationTime: {
        type: Date,
        
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    isLocked: {
        type: Boolean,
        default: false
    },

    loginCount: {
        type: Number,
        default: 0
    },

    role: {
        type: String,
        enum: Object.values(Role), 
        default: Role.USER,        
        required: true,
    }
});


export const User = model<IUser>('Users', UserSchema)