import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import myUserRoot from './routes/myUserRoute';
import myRestaurantRoute from './routes/myRestaurantRoute';
import { v2 as cloudinary } from 'cloudinary';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to db'))
  .catch((error) => console.log('Error ' + error));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/my/user', myUserRoot);
app.use('/api/my/restaurant', myRestaurantRoute);

app.listen(7000, () => {
  console.log('Server started on localhost:7000');
});
