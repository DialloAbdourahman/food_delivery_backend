import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import myUserRoot from './routes/myUserRoute';
import myRestaurantRoute from './routes/myRestaurantRoute';
import restaurantRoute from './routes/restaurantRoute';
import orderRoute from './routes/orderRoute';
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

app.use(cors());

// For stripe because it needs the raw data not the json data.
app.use('/api/order/checkout/webhook', express.raw({ type: '*/*' }));

app.use(express.json());

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'health OK!' });
});

app.use('/api/my/user', myUserRoot);
app.use('/api/my/restaurant', myRestaurantRoute);
app.use('/api/restaurants', restaurantRoute);
app.use('/api/order', orderRoute);

app.listen(7000, () => {
  console.log('Server started on localhost:7000');
});
