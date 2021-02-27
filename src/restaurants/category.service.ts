import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly category: Repository<Category>,
  ) {}

  async createCategory(
    createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    try {
      await this.category.save(this.category.create(createCategoryInput));
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
