import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/core/core.constants';
import { Dish, DishOption } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurants.entity';
import { User, UserRole } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { AssignRiderInput, AssignRiderOutput } from './dtos/assign-rider.dto';
import {
  EditStatusOrderInput,
  EditStatusOrderOutput,
} from './dtos/edit-status-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { OrderInput, OrderOutput } from './dtos/order.dto';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  sumTotalPrice = async (
    dishList: number[],
    dishOption: DishOption[],
  ): Promise<number> => {
    let total: number = 0;
    for (const dishId of dishList) {
      const dish = await this.dishes.findOne({ id: dishId });
      total += dish.price;
    }
    for (const option of dishOption) {
      if (option.extraPrice) total += option.extraPrice;
      if (option.choice) {
        for (const choice of option.choice) {
          if (choice.extraPrice) total += choice.extraPrice;
        }
      }
    }
    return total;
  };

  checkDishExisted = async (dishList: number[]): Promise<[boolean, Dish[]]> => {
    let result = true;
    let getDishes: Dish[] = [];
    //foreach는 async/await 사용 못함.
    for (const dish of dishList) {
      const isExist = await this.dishes.findOne({ id: dish });
      if (!isExist) {
        result = false;
      } else {
        getDishes.push(isExist);
      }
    }
    return [result, getDishes];
  };

  async order(user: User, orderInput: OrderInput): Promise<OrderOutput> {
    try {
      let order: Order;
      const { dishesId, dishOption } = orderInput;
      const [check, getDishes] = await this.checkDishExisted(dishesId);
      if (!check) {
        return {
          ok: false,
          error: 'One or more of the selected foods is invalid.',
        };
      }
      const dish = await this.dishes.findOne({ id: getDishes[0].id });
      const restaurant = await this.restaurants.findOne({
        id: dish.restaurantId,
      });
      const totalPrice = await this.sumTotalPrice(dishesId, dishOption);
      console.log(totalPrice);
      if (dishOption) {
        order = this.orders.create({
          client: user,
          dishes: getDishes,
          dishOption,
          totalPrice,
        });
        await this.orders.save(order);
        this.pubSub.publish('getOrderToOwner', {
          getOrderSubscription: { order, restaurantOwner: restaurant.owner },
        });
        return {
          ok: true,
        };
      } else {
        order = this.orders.create({
          client: user,
          dishes: getDishes,
          totalPrice,
        });
        await this.orders.save(order);
        this.pubSub.publish('getOrderToOwner', {
          getOrderSubscription: { order, restaurantOwner: restaurant.owner },
        });
        return {
          ok: true,
        };
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getOrder(getOrderInput: GetOrderInput): Promise<GetOrderOutput> {
    try {
      const { id } = getOrderInput;
      const order = await this.orders.findOne({ id });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      return {
        ok: true,
        order,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editOrder(
    user: User,
    editStatusOrderInput: EditStatusOrderInput,
  ): Promise<EditStatusOrderOutput> {
    try {
      const { id, status } = editStatusOrderInput;
      const order = await this.orders.findOne({ id });
      const dishOne = await this.dishes.findOne({ id: order.dishes[0].id });
      const restaurant = await this.restaurants.findOne({
        id: dishOne.restaurantId,
      });
      const restaurantOwner = restaurant.owner;
      if (!order || !dishOne || !restaurant) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (status === OrderStatus.REJECTED && user.role !== UserRole.Rider) {
        await this.orders.update({ id }, { status });
        this.pubSub.publish('changeOrder', {
          changeOrder: { order: { ...order, status }, restaurantOwner },
        });
        return {
          ok: true,
        };
      } else if (
        (status === OrderStatus.COOKED || status === OrderStatus.COOKING) &&
        user.role === UserRole.Owner
      ) {
        await this.orders.update({ id }, { status });
        this.pubSub.publish('changeOrder', {
          changeOrder: { order: { ...order, status }, restaurantOwner },
        });
        if (status === OrderStatus.COOKED) {
          this.pubSub.publish('cookedOrder', {
            cookedOrder: { order: { ...order, status } },
          });
        }
        return {
          ok: true,
        };
      } else if (
        (status === OrderStatus.PICKUP || status === OrderStatus.DELIVERED) &&
        user.role === UserRole.Rider
      ) {
        this.pubSub.publish('changeOrder', {
          changeOrder: { order: { ...order, status }, restaurantOwner },
        });
        await this.orders.update({ id }, { status });
        return {
          ok: true,
        };
      } else {
        return {
          ok: false,
          error: "You can't do this.",
        };
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async assignRider(
    user: User,
    assignRiderInput: AssignRiderInput,
  ): Promise<AssignRiderOutput> {
    try {
      const { id } = assignRiderInput;
      const order = await this.orders.findOne({ id }, { relations: ['rider'] });
      const dishOne = await this.dishes.findOne({ id: order.dishes[0].id });
      const restaurant = await this.restaurants.findOne({
        id: dishOne.restaurantId,
      });
      if (!order) {
        return {
          ok: false,
          error: 'Order not found.',
        };
      }
      if (order.rider) {
        return {
          ok: false,
          error: 'Rider has already been assigned.',
        };
      }
      await this.orders.update({ id }, { rider: user });
      this.pubSub.publish('changeOrder', {
        changeOrder: {
          order: { ...order, rider: user },
          restaurantOwner: restaurant.owner,
        },
      });
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
