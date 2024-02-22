import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request object from the execution context
    const request = context.switchToHttp().getRequest();
    // Extract the authorization header from the request
    const authorizationHeader = request.headers.authorization;

    // Check if the authorization header is missing
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Extract the token from the authorization header
    const token = this.extractTokenFromHeader(authorizationHeader);

    // Check if the token is missing
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      // Verify the token using the AuthService
      const decodedToken = await this.authService.verifyToken(token);
      // If token is valid, attach decoded token to the request object
      request.user = decodedToken;
      // Request is authorized
      return true;
    } catch (error) {
      // Handle token verification errors
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }
      // If token is invalid, throw unauthorized exception
      throw new UnauthorizedException('Invalid token');
    }
  }

  // Helper method to extract token from authorization header
  private extractTokenFromHeader(authorizationHeader: string): string | null {
    const [bearer, token] = authorizationHeader.split(' ');
    // Check if the authorization header is in correct format
    if (bearer !== 'Bearer' || !token) {
      return null;
    }
    // Return the extracted token
    return token;
  }
}
