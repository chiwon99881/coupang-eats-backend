import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Restaurant } from '../entities/restaurants.entity';

@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'description',
  'address',
  'tel',
]) {
  @Field((type) => Number)
  categoryId: number;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
