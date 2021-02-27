import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/core/core.decorator';
import { Role } from 'src/core/core.guard';
import { User, UserRole } from 'src/users/entities/users.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import {
  GetRestaurantInput,
  GetRestaurantOutput,
} from './dtos/get-restaurant.dto';
import {
  GetRestaurantsInput,
  GetRestaurantsOutput,
} from './dtos/get-restaurants.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import { Restaurant } from './entities/restaurants.entity';
import { RestaurantsService } from './restaurants.service';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation((returns) => CreateRestaurantOutput)
  @Role(UserRole.Owner)
  createRestaurant(
    @CurrentUser() user: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.restaurantsService.createRestaurant(
      user,
      createRestaurantInput,
    );
  }

  @Query((returns) => MyRestaurantsOutput)
  @Role(UserRole.Owner)
  myRestaurants(@CurrentUser() user: User): Promise<MyRestaurantsOutput> {
    return this.restaurantsService.myRestaurants(user);
  }

  @Query((returns) => GetRestaurantsOutput)
  getRestaurants(
    @Args('input') getRestaurantsInput: GetRestaurantsInput,
  ): Promise<GetRestaurantsOutput> {
    return this.restaurantsService.getRestaurants(getRestaurantsInput);
  }

  @Query((returns) => GetRestaurantOutput)
  getRestaurant(
    @Args('input') getRestaurantInput: GetRestaurantInput,
  ): Promise<GetRestaurantOutput> {
    return this.restaurantsService.getRestaurant(getRestaurantInput);
  }
}
