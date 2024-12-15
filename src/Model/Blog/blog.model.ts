import mongoose, { model, Schema } from "mongoose"
import { User } from "../user/user.model";

export interface Iblog {
    deleteOne(): unknown;
    save(): unknown;
    title: String,
    date: Date,
    content: String,
    user: String
}


const BlogSchema = new Schema<Iblog>({
    title: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
});


export const Blog = model<Iblog>('Blog', BlogSchema)