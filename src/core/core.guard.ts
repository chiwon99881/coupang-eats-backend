import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from 'src/users/entities/users.entity';

export const Role = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!role) {
      return true;
    }
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.user) {
      return false;
    }
    const currentUserRole = ctx.user.role;
    if (currentUserRole === role[0]) {
      return true;
    } else {
      return false;
    }
  }
}
