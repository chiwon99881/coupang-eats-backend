import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { CoreService } from './core.service';

export const Role = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly coreService: CoreService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const role = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!role) {
      if (ctx.token) {
        const encrypted = ctx.token;
        const decrypted = this.coreService.verify(encrypted.toString());
        const userId = decrypted['id'];
        if (userId) {
          const currentUser = await this.usersService.findUserById(userId);
          ctx['user'] = currentUser;
        }
      }
      return true;
    } else {
      const encrypted = ctx.token;
      if (encrypted) {
        const decrypted = this.coreService.verify(encrypted.toString());
        const userId = decrypted['id'];
        if (userId) {
          const currentUser = await this.usersService.findUserById(userId);
          ctx['user'] = currentUser;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    const currentUserRole = ctx.user.role;
    if (currentUserRole === role[0]) {
      return true;
    } else {
      return false;
    }
  }
}

@Injectable()
export class isLoggedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (ctx.user) {
      return true;
    } else {
      return false;
    }
  }
}
