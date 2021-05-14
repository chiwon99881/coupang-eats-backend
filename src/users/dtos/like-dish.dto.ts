import { CoreOutput } from '../../core/dtos/core.output.dto';
import { Dish } from '../../restaurants/entities/dish.entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';

@InputType()
export class LikeDishInput extends PickType(Dish, ['id']) {}

@ObjectType()
export class LikeDishOutput extends CoreOutput {}
