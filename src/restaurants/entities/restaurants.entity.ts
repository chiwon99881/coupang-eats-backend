import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { IsString } from 'class-validator';
import { User } from 'src/users/entities/users.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  description: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => String)
  @Column()
  @IsString()
  tel: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: 'CASCADE',
  })
  owner: User;
}
