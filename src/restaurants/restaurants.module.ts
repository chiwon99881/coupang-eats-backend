import { Module } from '@nestjs/common';
import { RestaurantsResolver } from './restaurants.resolver';

@Module({imports:[RestaurantsResolver]})
export class RestaurantsModule {}
