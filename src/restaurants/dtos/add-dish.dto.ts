import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Dish, DishOption } from '../entities/dish.entity';

@InputType()
export class AddDishInput extends PickType(Dish, [
  'name',
  'price',
  'description',
  'image',
]) {
  @Field((type) => Number)
  restaurantId: number;

  @Field((type) => [DishOption], { nullable: true })
  dishOption?: DishOption[];
}

@ObjectType()
export class AddDishOutput extends CoreOutput {}
