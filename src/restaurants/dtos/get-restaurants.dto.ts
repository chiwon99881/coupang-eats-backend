import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Restaurant } from '../entities/restaurants.entity';

@InputType()
export class GetRestaurantsInput {
  @Field((type) => Number)
  categoryId: number;

  @Field((type) => Number, { defaultValue: 1 })
  paginated: number;
}

@ObjectType()
export class GetRestaurantsOutput extends CoreOutput {
  @Field((type) => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field((type) => Number, { nullable: true })
  restaurantCount?: number;
}
