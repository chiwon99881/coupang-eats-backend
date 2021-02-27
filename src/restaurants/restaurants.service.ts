import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  GetRestaurantsInput,
  GetRestaurantsOutput,
} from './dtos/get-restaurants.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurants.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category) private readonly category: Repository<Category>,
  ) {}

  async createRestaurant(
    user: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const {
        address,
        description,
        name,
        tel,
        coverImage,
      } = createRestaurantInput;
      const categoryId = createRestaurantInput.categoryId;
      const category = await this.category.findOne({ id: categoryId });
      if (!category) {
        return {
          ok: false,
          error: 'This category not found.',
        };
      }
      await this.restaurants.save(
        this.restaurants.create({
          owner: user,
          name,
          coverImage,
          tel,
          description,
          address,
          category,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async myRestaurants(user: User): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurants.find({ owner: user });
      if (restaurants) {
        return {
          ok: true,
          restaurants,
        };
      }
      return {
        ok: false,
        error: 'Do not have restaurants.',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getRestaurants(
    getRestaurantsInput: GetRestaurantsInput,
  ): Promise<GetRestaurantsOutput> {
    try {
      const { categoryId } = getRestaurantsInput;
      const category = await this.category.findOne({ id: categoryId });
      if (!category) {
        return {
          ok: false,
          error: 'category not found.',
        };
      }
      const restaurants = await this.restaurants.find({ category });
      return {
        ok: true,
        restaurants,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
