import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Restaurant } from '../entities/restaurants.entity';

@InputType()
export class GetRestaurantsInput {
  @Field((type) => Number)
  categoryId: number;
}

@ObjectType()
export class GetRestaurantsOutput extends CoreOutput {
  @Field((type) => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
