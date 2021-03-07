import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Restaurant } from '../entities/restaurants.entity';

@InputType()
export class EditRestaurantInput extends PickType(Restaurant, ['id']) {
  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  description?: string;

  @Field((type) => String, { nullable: true })
  coverImage?: string;

  @Field((type) => String, { nullable: true })
  address?: string;

  @Field((type) => String, { nullable: true })
  tel?: string;

  @Field((type) => Number, { nullable: true })
  categoryId?: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
