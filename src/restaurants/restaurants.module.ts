import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/users.entity';
import { CategoryResolver } from './category.resolver';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurants.entity';
import { RestaurantsResolver } from './restaurants.resolver';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, User, Category])],
  providers: [
    RestaurantsResolver,
    RestaurantsService,
    CategoryResolver,
    CategoryService,
  ],
})
export class RestaurantsModule {}
