import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsJSON, IsNumber } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Dish, DishOption } from 'src/restaurants/entities/dish.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

export enum OrderStatus {
  REJECTED = 'REJECTED',
  PENDING = 'PENDING',
  COOKING = 'COOKING',
  COOKED = 'COOKED',
  PICKUP = 'PICKUP',
  DELIVERED = 'DELIVERED',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.orders, { eager: true })
  client: User;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, {
    nullable: true,
    eager: true,
  })
  rider?: User;

  @Field((type) => OrderStatus)
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field((type) => [Dish])
  @ManyToMany((type) => Dish, (dish) => dish.orders, { eager: true })
  dishes: Dish[];

  @Field((type) => Number, { defaultValue: 0 })
  @Column({ default: 0 })
  @IsNumber()
  totalPrice: number;

  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  @IsJSON()
  dishOption?: DishOption[];
}
