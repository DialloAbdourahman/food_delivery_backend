import express from 'express';
import {
  validateSearchRestaurantRequest,
  validateSearchRestaurantsRequest,
} from '../middleware/validation';
import restaurantController from '../controllers/restaurantController';

const router = express.Router();

router.get(
  '/:restaurantId',
  validateSearchRestaurantRequest,
  restaurantController.getRestaurant
);

router.get(
  '/search/:city',
  validateSearchRestaurantsRequest,
  restaurantController.searchRestaurants
);

export default router;
