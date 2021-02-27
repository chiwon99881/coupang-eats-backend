import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import { Restaurant } from './entities/restaurants.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async createRestaurant(
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      await this.restaurants.save(
        this.restaurants.create(createRestaurantInput),
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

  async myRestaurants(): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurants.find();
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
}
