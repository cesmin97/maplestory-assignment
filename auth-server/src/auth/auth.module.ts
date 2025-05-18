/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from 'src/user/service/user.service';
import { User, UserSchema } from '../user/schema/user.schema';
import { AuthController } from './controller/auth.controller';
import {
  FriendInviteHistory,
  FriendInviteHistorySchema,
} from './schema/friend-invite-history.schema';
import { JwtToken, JwtTokenSchema } from './schema/jwt-token.schema';
import {
  LoginHistory,
  LoginHistorySchema,
} from './schema/login-history.schema';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: JwtToken.name, schema: JwtTokenSchema },
      { name: LoginHistory.name, schema: LoginHistorySchema },
      { name: FriendInviteHistory.name, schema: FriendInviteHistorySchema },
    ]),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
