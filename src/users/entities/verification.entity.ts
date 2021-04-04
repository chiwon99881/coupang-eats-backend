import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Column, Entity, JoinTable, OneToOne } from 'typeorm';
import { User } from './users.entity';

@InputType('VerificationInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => Number)
  @IsNumber()
  userId: number;

  @Column()
  @Field((type) => Number)
  @IsNumber()
  code: number;
}
