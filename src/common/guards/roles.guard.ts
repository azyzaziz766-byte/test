import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // نجيب الـ roles المطلوبة من الـ decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // إذا الـ route ما فيهاش @Roles
    if (!requiredRoles) {
      return true;
    }

    // نجيب المستخدم من request
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // لازم يكون المستخدم authenticated
    if (!user) {
      return false;
    }

    // نقارن الـ role
    return requiredRoles.includes(user.role);
  }
}
