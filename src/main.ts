import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthorizationMiddleware } from './auth/controller/authorization.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new AuthorizationMiddleware().use); // Apply the middleware globally

  await app.listen(3000);
}
bootstrap();
