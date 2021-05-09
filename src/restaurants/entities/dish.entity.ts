import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsJSON, IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { Restaurant } from './restaurants.entity';

@InputType('OptionChoiceInputType', { isAbstract: true })
@ObjectType()
export class OptionChoice {
  @Field((type) => String)
  @IsString()
  kind: string;

  @Field((type) => Number, { nullable: true })
  @IsNumber()
  extraPrice?: number;
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
  @Field((type) => String)
  @IsString()
  option: string;

  @Field((type) => [OptionChoice], { nullable: true })
  @IsString()
  choice?: OptionChoice[];

  @Field((type) => Number, { nullable: true })
  @IsNumber()
  extraPrice?: number;
}

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

  @Field((type) => String)
  @Column()
  @IsString()
  image: string;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.dishes, {
    onDelete: 'CASCADE',
    eager: true,
  })
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  @IsJSON()
  dishOption?: DishOption[];

  @Field((type) => [Order], { nullable: true })
  @ManyToMany((type) => Order, (order) => order.dishes)
  @JoinTable()
  orders?: Order[];

  @Field((type) => [User], { nullable: true })
  @ManyToMany((type) => User, (user) => user.favFood, { nullable: true })
  like?: User[];
}
