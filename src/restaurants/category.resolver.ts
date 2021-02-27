import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { Category } from './entities/category.entity';

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation((returns) => CreateCategoryOutput)
  createCategory(
    @Args('input') createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    return this.categoryService.createCategory(createCategoryInput);
  }
}
