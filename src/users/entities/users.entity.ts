import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Restaurant } from 'src/restaurants/entities/restaurants.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Order } from 'src/orders/entities/order.entity';
import { Dish } from 'src/restaurants/entities/dish.entity';

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

  @Field((type) => Boolean, { defaultValue: false })
  @Column({ default: false })
  @IsBoolean()
  verified: boolean;

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

  @Field((type) => [Order], { nullable: true })
  @OneToMany((type) => Order, (order) => order.client, {
    nullable: true,
  })
  orders?: Order[];

  @Field((type) => [Dish], { nullable: true })
  @ManyToMany((type) => Dish, (dish) => dish.liked, {
    nullable: true,
  })
  @JoinTable()
  favFood?: Dish[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
  }

  async checkPassword(plainPassword: string): Promise<boolean> {
    if (!plainPassword) {
      return false;
    }
    return await bcrypt.compare(plainPassword, this.password);
  }
}
