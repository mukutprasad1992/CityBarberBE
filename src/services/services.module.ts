// modules/service/service.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Service, ServiceSchema } from 'src/schemas/services.schema';
import { ServiceController } from 'src/services/services.controller';
import { ServiceService } from 'src/services/services.service';
import { JwtAuthGuard } from 'src/auth/controller/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Service.name, schema: ServiceSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [ServiceController],
  providers: [ServiceService, JwtAuthGuard],
})
export class ServiceModule {}
