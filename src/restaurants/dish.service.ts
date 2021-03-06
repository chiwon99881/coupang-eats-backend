import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { AddDishInput, AddDishOutput } from './dtos/add-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import { GetDishInput, GetDishOutput } from './dtos/get-dish.dto';
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

  async deleteDish(
    user: User,
    deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const { id: dishId } = deleteDishInput;
      const dish = await this.dishes.findOne({ id: dishId });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found.',
        };
      }
      const restaurant = await this.restaurants.findOne({
        id: dish.restaurantId,
      });
      if (restaurant.owner.id !== user.id) {
        return {
          ok: false,
          error: "You can't do this.",
        };
      }
      await this.dishes.delete({ id: dish.id });
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

  async editDish(
    user: User,
    editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    try {
      const { id: dishId } = editDishInput;
      const dish = await this.dishes.findOne({ id: dishId });
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found.',
        };
      }
      const restaurant = await this.restaurants.findOne({
        id: dish.restaurantId,
      });
      if (restaurant.owner.id !== user.id) {
        return {
          ok: false,
          error: "You can't do this.",
        };
      }
      await this.dishes.update({ id: dish.id }, { ...editDishInput });
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

  async getDish(getDishInput: GetDishInput): Promise<GetDishOutput> {
    try {
      const { id: dishId } = getDishInput;
      const dish = await this.dishes.findOne(
        { id: dishId },
        { relations: ['restaurant'] },
      );
      if (!dish) {
        return {
          ok: false,
          error: 'Dish not found.',
        };
      }
      return {
        ok: true,
        dish,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
