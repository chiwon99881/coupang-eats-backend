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

  @Subscription((returns) => Order, {
    filter: (
      {
        getOrderSubscription: { restaurantOwner },
      }: { getOrderSubscription: { restaurantOwner: User } },
      _,
      { user }: { user: User },
    ) => {
      return restaurantOwner.id === user.id;
    },
    resolve: ({
      getOrderSubscription: { order },
    }: {
      getOrderSubscription: { order: Order };
    }) => order,
  })
  @Role(UserRole.Owner)
  getOrderSubscription() {
    return this.pubSub.asyncIterator('getOrderToOwner');
  }
}
