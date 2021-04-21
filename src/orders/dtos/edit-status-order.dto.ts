import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Order } from '../entities/order.entity';

@InputType()
export class EditStatusOrderInput extends PickType(Order, ['id', 'status']) {}

@ObjectType()
export class EditStatusOrderOutput extends CoreOutput {}
