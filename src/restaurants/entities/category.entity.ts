import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './restaurants.entity';

@InputType('CategoryInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  image: string;

  @Field((type) => [Restaurant], { nullable: true })
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category, {
    nullable: true,
    eager: true,
  })
  restaurants?: Restaurant[];
}
