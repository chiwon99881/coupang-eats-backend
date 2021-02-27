import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CoreService {
  constructor(@Inject('PRIVATE_KEY') private readonly PRIVATE_KEY: string) {}

  sign(userId: number): string {
    return jwt.sign({ id: userId }, this.PRIVATE_KEY);
  }
}
