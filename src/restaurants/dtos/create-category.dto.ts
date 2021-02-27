import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/core/dtos/core.output.dto';
import { Category } from '../entities/category.entity';

@InputType()
export class CreateCategoryInput extends PickType(Category, [
  'name',
  'image',
]) {}

@ObjectType()
export class CreateCategoryOutput extends CoreOutput {}
