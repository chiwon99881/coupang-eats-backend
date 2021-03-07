import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import {
  GetRestaurantInput,
  GetRestaurantOutput,
} from './dtos/get-restaurant.dto';
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

  async editRestaurant(
    user: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const { id: restaurantId } = editRestaurantInput;
      const restaurant = await this.restaurants.findOne({ id: restaurantId });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      if (user.id !== restaurant.owner.id) {
        return {
          ok: false,
          error: "You can't do this.",
        };
      }
      if (editRestaurantInput.categoryId) {
        const category = await this.category.findOne({
          id: editRestaurantInput.categoryId,
        });
        if (!category) {
          return {
            ok: false,
            error: 'Category not found.',
          };
        }
        delete editRestaurantInput.categoryId;
        await this.restaurants.update(
          { id: restaurantId },
          { category, ...editRestaurantInput },
        );
      } else {
        await this.restaurants.update(
          { id: restaurantId },
          { ...editRestaurantInput },
        );
      }
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

  async deleteRestaurant(
    user: User,
    deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    try {
      const { id: restaurantId } = deleteRestaurantInput;
      const restaurant = await this.restaurants.findOne({ id: restaurantId });
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      if (user.id !== restaurant.owner.id) {
        return {
          ok: false,
          error: "You can't do this.",
        };
      }
      await this.restaurants.delete({ id: restaurant.id });
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
      const { categoryId, paginated } = getRestaurantsInput;
      const category = await this.category.findOne({ id: categoryId });
      if (!category) {
        return {
          ok: false,
          error: 'category not found.',
        };
      }
      const [
        restaurants,
        restaurantCount,
      ] = await this.restaurants.findAndCount({
        where: { category },
        order: { id: 'DESC' },
        skip: (paginated - 1) * 10,
        take: paginated * 10,
      });
      return {
        ok: true,
        restaurants,
        restaurantCount,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getRestaurant(
    getRestaurantInput: GetRestaurantInput,
  ): Promise<GetRestaurantOutput> {
    try {
      const { id } = getRestaurantInput;
      const restaurant = await this.restaurants.findOne(
        { id },
        { relations: ['dishes'] },
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
