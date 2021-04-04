import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { User } from 'src/users/entities/users.entity';
import { Entity, ManyToMany, ManyToOne } from 'typeorm';

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.orders)
  client: User;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.orders)
  delivery: User;

  @Field((type) => [Dish])
  @ManyToMany((type) => Dish, (dish) => dish.orders)
  dishes: Dish[];
}
