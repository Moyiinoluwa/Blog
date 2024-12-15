import express from 'express';
import { blogController } from './blog.controller';
import { userAuth } from '../../Middleware/auth';
const blogRouter = express.Router();


//register
blogRouter.post('/create', userAuth, blogController.createBlog)

//update
blogRouter.put('/update/:_id', userAuth, blogController.updateBlog)

//delete
blogRouter.delete('/delete/:_id', userAuth, blogController.deleteBlog)

//all blogs
blogRouter.get('/get', userAuth, blogController.getBlogs)

export default blogRouter;