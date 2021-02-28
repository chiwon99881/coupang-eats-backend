import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Dish } from './dish.entity';

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class DishOption extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  option: string;

  @Field((type) => String)
  @Column()
  @IsString()
  choice: string;

  @Field((type) => [Dish], { nullable: true })
  @ManyToMany((type) => Dish, (dish) => dish.dishOption, { nullable: true })
  @JoinTable()
  dish?: Dish[];
}
