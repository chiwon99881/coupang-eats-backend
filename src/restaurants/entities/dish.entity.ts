import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { DishOption } from './dish-option.entity';
import { Restaurant } from './restaurants.entity';

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  description: string;

  @Field((type) => Number)
  @Column()
  @IsNumber()
  price: number;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.dishes, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Field((type) => [DishOption], { nullable: true })
  @ManyToMany((type) => DishOption, (dishOption) => dishOption.dish, {
    nullable: true,
  })
  dishOption?: DishOption[];
}
