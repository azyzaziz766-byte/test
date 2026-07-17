import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { AuthService } from './application/auth.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/domain/user.entity';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    PassportModule,

    JwtModule.register({
      secret: 'JWT_SECRET_KEY',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
