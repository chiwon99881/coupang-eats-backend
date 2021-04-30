import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Order } from '../entities/order.entity';

@InputType()
export class AssignRiderInput extends PickType(Order, ['id']) {}

@ObjectType()
export class AssignRiderOutput extends CoreOutput {}
