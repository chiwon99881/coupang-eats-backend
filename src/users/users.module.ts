import { Dish } from 'src/restaurants/entities/dish.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreService } from 'src/core/core.service';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification, Dish])],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
