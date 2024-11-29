import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUri: string = process.env.DB_URI || ''
export const connection = () => {
   mongoose.connect(dbUri)
      .then(() => console.log('connected to database'))
      .catch((err) => console.log(err))
}