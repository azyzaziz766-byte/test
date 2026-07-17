import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // التحقق من وجود المستخدم وصلاحيته
    if (!user) {
      throw new ForbiddenException('غير مصرح بالدخول - يلزم تسجيل الدخول');
    }

    // التحقق من أن المستخدم لديه صلاحية admin
    if (user.role !== 'user') {
      throw new ForbiddenException('هذه المنطقة مخصصة users');
    }

    return true;
  }
}
