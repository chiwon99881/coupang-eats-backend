import { Dish } from './../../restaurants/entities/dish.entity';
import { Restaurant } from './../../restaurants/entities/restaurants.entity';
import { CoreOutput } from './../../core/dtos/core.output.dto';
import { Field, InputType, ObjectType } from '@nestjs/graphql';

@InputType()
export class SearchInput {
  @Field((type) => String)
  key: string;

  @Field((type) => Number, { defaultValue: 1 })
  page: number;
}

@ObjectType()
export class SearchOutput extends CoreOutput {
  @Field((type) => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];

  @Field((type) => Number, { nullable: true })
  restaurantsCount?: number;

  @Field((type) => [Dish], { nullable: true })
  dishes?: Dish[];

  @Field((type) => Number, { nullable: true })
  dishCount?: number;
}
