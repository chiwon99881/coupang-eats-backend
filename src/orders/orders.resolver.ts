import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/core/core.constants';
import { CurrentUser } from 'src/core/core.decorator';
import { isLoggedGuard, Role } from 'src/core/core.guard';
import { User, UserRole } from 'src/users/entities/users.entity';
import {
  EditStatusOrderInput,
  EditStatusOrderOutput,
} from './dtos/edit-status-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { OrderInput, OrderOutput } from './dtos/order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Resolver((of) => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation((returns) => OrderOutput)
  @Role(UserRole.Client)
  order(@CurrentUser() user: User, @Args('input') orderInput: OrderInput) {
    return this.ordersService.order(user, orderInput);
  }

  @Query((returns) => GetOrderOutput)
  @UseGuards(isLoggedGuard)
  getOrder(
    @CurrentUser() user: User,
    @Args('input') getOrderInput: GetOrderInput,
  ): Promise<GetOrderOutput> {
    return this.ordersService.getOrder(getOrderInput);
  }

  @Mutation((returns) => EditStatusOrderOutput)
  @UseGuards(isLoggedGuard)
  editOrder(
    @CurrentUser() user: User,
    @Args('input') editStatusOrderInput: EditStatusOrderInput,
  ): Promise<EditStatusOrderOutput> {
    return this.ordersService.editOrder(user, editStatusOrderInput);
  }

  @Mutation((returns) => Boolean)
  async fakeOrder() {
    await this.pubSub.publish('getOrderToOwner', {
      getOrderSubscription: { ok: true },
    });
    return true;
  }

  @Subscription((returns) => GetOrderOutput, {
    filter: (payload, variables, context) => {
      console.log(payload, variables, context);
      return true;
    },
  })
  @Role(UserRole.Owner)
  getOrderSubscription() {
    return this.pubSub.asyncIterator('getOrderToOwner');
  }
}
