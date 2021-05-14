import { CoreOutput } from './../../core/dtos/core.output.dto';
import { Dish } from './../../restaurants/entities/dish.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class UnlikeDishInput extends PickType(Dish, ['id']) {}

@ObjectType()
export class UnlikeDishOutput extends CoreOutput {}
