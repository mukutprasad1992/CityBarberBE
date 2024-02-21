import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {

  // Middleware function to handle authorization
  use(req: any, res: any, next: () => void) {

    // Extract authorization header from request
    const authorizationHeader = req.headers['authorization'];

    // Check if authorization header exists
    if (authorizationHeader) {

      // Extract token from authorization header
      const token = authorizationHeader.replace('Bearer ', '');

      try {
        // Verify the token using JWT and extract userId and userType
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as {

          userId: string;

          userType: string;
        };

        // Attach decoded user information to the request object
        req.user = {

          userId: decodedToken.userId,

          userType: decodedToken.userType,
        };

        // Log decoded token for debugging purposes
        console.log('Decoded Token:', decodedToken);

      } catch (error) {
        
        // Handle token verification error if needed
        console.error('Token verification error:', error);
      }
    }

    // Proceed to the next middleware or route handler
    next();
  }
}
