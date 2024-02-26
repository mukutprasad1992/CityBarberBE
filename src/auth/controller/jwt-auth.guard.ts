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
    console.log("authorizationHeader:", authorizationHeader)
    console.log("Split length:", authorizationHeader.split(' ').length);

    // Check if the authorization header is missing
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Extract the token from the authorization header
    const token = this.extractTokenFromHeader(authorizationHeader);

    console.log(" before token:", token)
    // Check if the token is missing
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    console.log(" after token:", token)

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
    // Check if the authorization header contains any spaces
    if (!authorizationHeader.includes(' ')) {
      // If no spaces are found, assume the entire header is the token
      return authorizationHeader;
    }

    // Split the authorization header into parts
    const parts = authorizationHeader.split(' ');

    console.log("Split length:", parts.length);

    // Check if the authorization header is in correct format
    if (parts.length !== 2) {
      return null;
    }

    // If the header is in the format "Bearer <token>"
    const [bearer, token] = parts;
    if (bearer === 'Bearer' && token) {
      return token;
    }

    // If the header doesn't start with "Bearer ", assume the token is directly provided
    return authorizationHeader;
  }


}
