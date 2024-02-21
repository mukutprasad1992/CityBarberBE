import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  // Method to determine if the request is authorized
  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {

    // Extract request object from execution context
    const request = context.switchToHttp().getRequest();

    // Extract token from authorization header
    const token = this.extractTokenFromHeader(request.headers.authorization);

    // If token is not found, log error and return false
    if (!token) {
      console.error('Token not found in the authorization header.');

      return false;
    }

    // Verify the token using AuthService
    return this.authService.verifyToken(token).then((decodedToken) => {

      // If token is verified, attach user information to the request object
      request.user = decodedToken as { userId: string; user: string };

      console.log('Authenticated user:', request.user);

      return true; // Request is authorized

    }).catch((error) => {

      // If token verification fails, log error and return false
      console.error('Token verification failed:', error.message);

      console.error('Received Token for Verification:', token);

      console.error('Request URL:', request.url);

      return false;

    });
  }

  // Method to extract token from authorization header
  extractTokenFromHeader(authorizationHeader: string): string | null {
    // If authorization header is missing, return null
    if (!authorizationHeader) {
      return null;
    }
    // Split authorization header to extract bearer and token
    const [bearer, token] = authorizationHeader.split(' ');

    // If bearer is not 'Bearer' or token is missing, return null
    if (bearer !== 'Bearer' || !token) {
      return null;
    }

    // Return the extracted token
    return token;
  }
}
