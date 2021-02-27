import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Restaurant } from '../entities/restaurants.entity';

@InputType()
export class GetRestaurantInput extends PickType(Restaurant, ['id']) {}

@ObjectType()
export class GetRestaurantOutput extends CoreOutput {
  @Field((type) => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
