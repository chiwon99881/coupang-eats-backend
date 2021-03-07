import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class GetDishInput extends PickType(Dish, ['id']) {}

@ObjectType()
export class GetDishOutput extends CoreOutput {
  @Field((type) => Dish, { nullable: true })
  dish?: Dish;
}
