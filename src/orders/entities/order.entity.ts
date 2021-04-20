import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsJSON } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Dish, DishOption } from 'src/restaurants/entities/dish.entity';
import { User } from 'src/users/entities/users.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.orders, { eager: true })
  client: User;

  @Field((type) => User, { nullable: true })
  @ManyToOne((type) => User, (user) => user.orders, { nullable: true })
  delivery?: User;

  @Field((type) => [Dish])
  @ManyToMany((type) => Dish, (dish) => dish.orders, { eager: true })
  dishes: Dish[];

  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  @IsJSON()
  dishOption?: DishOption[];
}
