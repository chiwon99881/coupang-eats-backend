import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { User } from '../entities/users.entity';

@InputType()
export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'phone',
  'address',
  'role',
]) {
  @Field((type) => String, { nullable: true })
  alias?: string;

  @Field((type) => String, { nullable: true })
  avatar?: string;
}

@ObjectType()
export class CreateUserOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
