import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { CoreService } from './core.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly coreService: CoreService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const encrypted = req.headers['x-jwt'];
    if (encrypted) {
      const decrypted = this.coreService.verify(encrypted.toString());
      const userId = decrypted['id'];
      if (userId) {
        const currentUser = await this.usersService.findUserById(userId);
        req['user'] = currentUser;
      }
    }
    next();
  }
}
