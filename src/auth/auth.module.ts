import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PrismaModule } from '../prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PrismaModule, PassportModule,
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any },
      }),
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService , JwtStrategy , PassportModule],
})
export class AuthModule { }
