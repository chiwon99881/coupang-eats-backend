import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { AddDishInput, AddDishOutput } from './dtos/add-dish.dto';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurants.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  async addDish(
    user: User,
    addDishInput: AddDishInput,
  ): Promise<AddDishOutput> {
    try {
      const { restaurantId } = addDishInput;
      const restaurant = await this.restaurants.findOne({ id: restaurantId });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      if (restaurant.owner.id !== user.id) {
        return {
          ok: false,
          error: 'Not your restaurant.',
        };
      }
      await this.dishes.save(
        this.dishes.create({ ...addDishInput, restaurant }),
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
}
