import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { User, UserRole } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
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
  ) {}

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
      const { dishesId, dishOption } = orderInput;
      const [check, getDishes] = await this.checkDishExisted(dishesId);
      if (!check) {
        return {
          ok: false,
          error: 'One or more of the selected foods is invalid.',
        };
      }
      if (dishOption) {
        await this.orders.save(
          this.orders.create({ client: user, dishes: getDishes, dishOption }),
        );
        return {
          ok: true,
        };
      } else {
        await this.orders.save(
          this.orders.create({ client: user, dishes: getDishes }),
        );
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
      if (status === OrderStatus.REJECTED && user.role !== UserRole.Rider) {
        await this.orders.update({ id }, { status });
        return {
          ok: true,
        };
      } else if (
        status === OrderStatus.COOKED ||
        status === OrderStatus.COOKING
      ) {
        if (user.role === UserRole.Owner) {
          await this.orders.update({ id }, { status });
        }
      } else if (
        status === OrderStatus.PICKUP ||
        status === OrderStatus.DELIVERED
      ) {
        if (user.role == UserRole.Rider) {
          await this.orders.update({ id }, { status });
        }
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
}
