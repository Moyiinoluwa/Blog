import express from 'express';
import { blogController } from './blog.controller';
const blogRouter = express.Router();


//register
blogRouter.post('/create', blogController.createBlog)

//update
blogRouter.put('/update/:_id', blogController.updateBlog)

//delete
blogRouter.delete('delete/:_id', blogController.deleteBlog)

//all blogs
blogRouter.get('/get', blogController.getBlogs)

export default blogRouter;