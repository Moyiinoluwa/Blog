import { Request, NextFunction } from "express";
import { blogValidator } from "./Validator/blog.validator";
import { blogService } from "./blog.service";
import ApiError from "../../Utils/apiError";
import httpStatus from "http-status";

export class BlogController {
    public async createBlog(req: Request, res: any, next: NextFunction) {
        try {
            const { error } = blogValidator.createBlogValidation(req.body);
            if (error)
                throw new ApiError(httpStatus.BAD_REQUEST, error.details[0].message)

            const { message } = await blogService.createBlog(req)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }

    }


    public async updateBlog(req: Request, res: any, next: NextFunction) {
        try {
            const { error } = blogValidator.updateBlogValidator(req.body)
            if (error) {
                res.status(400).json({ error: error.details[0].message })
            }

            const { message } = await blogService.updateBlog(req)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //delete
    public async deleteBlog(req: Request, res: any, next: NextFunction) {
        try {
            const { message } = await blogService.deleteBlog(req)
            if (message) {
                res.status(200).json({ message })
            }
        } catch (error) {
            next(error)
        }
    }

    //get all blogs
    public async getBlogs(req: Request, res: any, next: NextFunction) {
        try {
            const { blogs} = await blogService.getBlogs(req) 
            if(blogs) {
                res.status(200).json({ blogs })
            }
        } catch (error) {
            next(error)
        }
    }
}

const blogController = new BlogController();
export { blogController }