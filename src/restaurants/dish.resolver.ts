import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/core/core.decorator';
import { Role } from 'src/core/core.guard';
import { User, UserRole } from 'src/users/entities/users.entity';
import { DishService } from './dish.service';
import { AddDishInput, AddDishOutput } from './dtos/add-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import { GetDishInput, GetDishOutput } from './dtos/get-dish.dto';
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

  @Mutation((returns) => EditDishOutput)
  @Role(UserRole.Owner)
  editDish(
    @CurrentUser() user: User,
    @Args('input') editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    return this.dishService.editDish(user, editDishInput);
  }

  @Query((returns) => GetDishOutput)
  getDish(@Args('input') getDishInput: GetDishInput): Promise<GetDishOutput> {
    return this.dishService.getDish(getDishInput);
  }
}
