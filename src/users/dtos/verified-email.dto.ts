import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Verification } from '../entities/verification.entity';

@InputType()
export class VerifiedEmailInput extends PickType(Verification, ['code']) {}

@ObjectType()
export class VerifiedEmailOutput extends CoreOutput {}
