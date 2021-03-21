import { IsNumber } from 'class-validator';
import { CoreEntity } from 'src/core/entities/core.entity';
import { Column, Entity, JoinTable, OneToOne } from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Verification extends CoreEntity {
  @Column()
  @IsNumber()
  userId: number;

  @Column()
  @IsNumber()
  code: number;
}
