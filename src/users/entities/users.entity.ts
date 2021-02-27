import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurants.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Rider = 'Rider',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => String)
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Field((type) => String)
  @Column()
  @IsString()
  password: string;

  @Field((type) => String, { defaultValue: 'anonymous' })
  @Column({ nullable: true, default: 'anonymous' })
  @IsString()
  alias?: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  avatar: string;

  @Field((type) => String)
  @Column()
  @IsString()
  phone: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @Field((type) => [Restaurant], { nullable: true })
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner, {
    nullable: true,
  })
  restaurants?: Restaurant[];
}
