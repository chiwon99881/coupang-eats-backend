import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/core/core.decorator';
import { Role } from 'src/core/core.guard';
import { User, UserRole } from 'src/users/entities/users.entity';
import { DishService } from './dish.service';
import { AddDishInput, AddDishOutput } from './dtos/add-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { Dish } from './entities/dish.entity';

@Resolver((of) => Dish)
export class DishResolver {
  constructor(private readonly dishService: DishService) {}

  @Mutation((returns) => AddDishOutput)
  @Role(UserRole.Owner)
  addDish(
    @CurrentUser() user: User,
    @Args('input') addDishInput: AddDishInput,
  ): Promise<AddDishOutput> {
    return this.dishService.addDish(user, addDishInput);
  }

  @Mutation((returns) => DeleteDishOutput)
  @Role(UserRole.Owner)
  deleteDish(
    @CurrentUser() user: User,
    @Args('input') deleteDishInput: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    return this.dishService.deleteDish(user, deleteDishInput);
  }
}
