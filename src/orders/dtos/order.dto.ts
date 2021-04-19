import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { DishOption } from 'src/restaurants/entities/dish.entity';

@InputType()
export class OrderInput {
  @Field((type) => [Number])
  dishesId: number[];

  @Field((type) => [DishOption], { nullable: true })
  dishOption?: DishOption[];
}

@ObjectType()
export class OrderOutput extends CoreOutput {}
