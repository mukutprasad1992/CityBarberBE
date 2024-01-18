// authorization.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader) {
      const token = authorizationHeader.replace('Bearer ', '');

      try {
        const decodedToken = jwt.verify(token, process.env.ForgetPasswordKey) as { userId: string };
        req.decodedToken = decodedToken;
      } catch (error) {
        // Handle token verification error if needed
        console.log({error:"hellow"});
      }
    }

    next();
  }
}
