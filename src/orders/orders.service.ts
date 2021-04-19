import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { OrderInput, OrderOutput } from './dtos/order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Dish) private readonly dishes: Repository<Dish>,
  ) {}

  checkDishExisted = async (dishList: number[]): Promise<boolean> => {
    let result = true;
    //foreach는 async/await 사용 못함.
    for (const dish of dishList) {
      const isExist = await this.dishes.findOne({ id: dish });
      if (!isExist) {
        result = false;
      }
    }
    return result;
  };

  async order(user: User, orderInput: OrderInput): Promise<OrderOutput> {
    try {
      const { dishesId } = orderInput;
      const check = await this.checkDishExisted(dishesId);
      if (!check) {
        return {
          ok: false,
          error: 'One or more of the selected foods is invalid.',
        };
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
}
