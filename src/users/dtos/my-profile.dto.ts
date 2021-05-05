import { CoreOutput } from './../../core/dtos/core.output.dto';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/users.entity';

@ObjectType()
export class MeOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
