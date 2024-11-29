import { Blog, Iblog } from "../../Model/Blog/blog.model";
import { Request, Response } from "express";
export class BlogService {

    //CREATE BLOG
    public async createBlog(req: Request, res: Response) {

        const { title, content } = req.body;

        //check if blog is existing
        const blog = await Blog.findOne({ title: title })
        if (blog) {
            res.status(401).json({ message: 'blog has been created' })
        }

        //create new blog
        const newBlog = new Blog()
        newBlog.title = title;
        newBlog.content = content;
        newBlog.date = new Date();

        //save to database
        await newBlog.save()

        return { message: 'new blog created' }
    }

    //Update blog
    public async updateBlog(req: Request, res: Response) {
        try {
            //find blog by id
            const { _id } = req.params;
            const { title, content } = req.body;

            const blog = await Blog.findById(_id) as unknown as Iblog
            if (!blog) {
                res.status(404).json({ error: ' cannot update blog' })
            }

            //update
            blog.title = title;
            blog.content = content;

            //save to database
            await blog.save()

            return { message: 'blog update'}

        } catch (error) {
            throw error
        }
    }

    //DELETE BLOG
    public async deleteBlog(req: Request, res: Response) {
        try {
            const { _id } = req.params;

            //find blog by id
            const blog = await Blog.findById(_id) as unknown as Iblog
            if(!blog) {
                res.status(404).json({ error: 'cannot delete blog'})
            }

            await blog.deleteOne()

            return { message: 'blog deleted'}
            
        } catch (error) {
            throw error
        }
    }

    //GET ALL BLOGS
    public async getBlogs(req: Request, res: Response) {
        const blogs = await Blog.find()
        if(blogs.length === 0) {
            res.status(404).json({ error: 'no blogs'})
        }

        return { blogs }
    }

}

const blogService = new BlogService();
export { blogService }