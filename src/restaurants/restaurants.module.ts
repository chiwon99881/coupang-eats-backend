import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { DishResolver } from './dish.resolver';
import { DishService } from './dish.service';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurants.entity';
import { RestaurantsResolver } from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, User, Category, Dish])],
  providers: [
    RestaurantsResolver,
    RestaurantsService,
    CategoryResolver,
    CategoryService,
    DishResolver,
    DishService,
  ],
})
export class RestaurantsModule {}
