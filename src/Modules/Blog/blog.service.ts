import { Blog, Iblog } from "../../Model/Blog/blog.model";
import { Request, Response } from "express";
import { IUser, User } from "../../Model/user/user.model";
import httpStatus from "http-status";
import ApiError from "../../Utils/apiError";



export class BlogService {
    //CREATE BLOG
    public async createBlog(req: Request ) {

        const { _id } = req.params;
        const { title, content } = req.body;

        //check if blog is existing
        const blog = await Blog.findOne({ title: title }) as unknown as Iblog
        if (blog)
            throw new ApiError(httpStatus.BAD_REQUEST,'blog has been created' )

        //check if user exists
        const user = await User.findById(_id) as unknown as IUser
        if (!user)
            throw new ApiError(httpStatus.FORBIDDEN, 'user does not exist')

        //create new blog
        const newBlog = new Blog()
        newBlog.title = title;
        newBlog.content = content;
        newBlog.date = new Date();
        newBlog.user = user._id

        //save to database
        await newBlog.save()

        return { message: 'new blog created' }
    }

    //Update blog
    public async updateBlog(req: Request) {
        try {
            //find blog by id
            const { _id } = req.params;
            const { title, content } = req.body;

            const blog = await Blog.findById(_id) as unknown as Iblog
            if (!blog) 
                throw new ApiError(httpStatus.BAD_REQUEST, ' cannot update blog')

            //update
            blog.title = title;
            blog.content = content;

            //save to database
            await blog.save()

            return { message: 'blog update' }

        } catch (error) {
            throw error
        }
    }

    //DELETE BLOG
    public async deleteBlog(req: Request ) {
        try {
            const { _id } = req.params;

            //find blog by id
            const blog = await Blog.findById(_id) as unknown as Iblog
            if (!blog)
                throw new ApiError(httpStatus.BAD_REQUEST, 'cannot delete blog')

            await blog.deleteOne()

            return { message: 'blog deleted' }

        } catch (error) {
            throw error
        }
    }

    //GET ALL BLOGS
    public async getBlogs(req: Request ) {
        const blogs = await Blog.find()
        if (blogs.length === 0)
            throw new ApiError(httpStatus.NOT_FOUND, ' there are no blogs')

        return { blogs }
    }

}

const blogService = new BlogService();
export { blogService }