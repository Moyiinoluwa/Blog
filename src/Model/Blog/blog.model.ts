import { model, Schema } from "mongoose"

export interface Iblog {
    deleteOne(): unknown;
    save(): unknown;
    title: String,
    date: Date,
    content: String
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
    }
});


export const Blog = model<Iblog>('Blog', BlogSchema)