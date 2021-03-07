import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Dish, DishOption } from '../entities/dish.entity';

@InputType()
export class EditDishInput extends PickType(Dish, ['id']) {
  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => String, { nullable: true })
  image?: string;

  @Field((type) => String, { nullable: true })
  description?: string;

  @Field((type) => Number, { nullable: true })
  price?: number;

  @Field((type) => [DishOption], { nullable: true })
  dishOption?: DishOption[];
}

@ObjectType()
export class EditDishOutput extends CoreOutput {}
