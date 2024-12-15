import express, { Express, Request, Response } from 'express';
import { connection } from './Config/dbConnection';
import router from './Modules/User/user.routes';
import adminRouter from './Modules/Admin/admin.routes';
import blogRouter from './Modules/Blog/blog.route';
import dotenv from 'dotenv'


const app: Express = express()

//middleware 
app.use(express.json()) 

//database connection
connection();

//configure dotenv
dotenv.config()

//routes
app.use('/api/user', router)
app.use('/api/admin', adminRouter)
app.use('/api/blog', blogRouter)

//port
const port = process.env.PORT || 3000;

//listening on port
app.listen(port, () => {
   console.log(`app is listening on port ${port}`)
})