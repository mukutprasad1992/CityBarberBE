// jwt-auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      return false;
    }

    return this.authService
      .verifyToken(token)
      .then((decodedToken) => {
        // Set user information in the request object
        request.user = decodedToken as { userId: string; user: string };

        return true;
      })
      .catch(() => false);
  }

  private extractTokenFromHeader(authorizationHeader: string): string | null {
    if (!authorizationHeader) {
      return null;
    }

    const [, token] = authorizationHeader.split(' ');
    return token || null;
  }
}
