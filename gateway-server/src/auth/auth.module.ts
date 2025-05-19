/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtToken, JwtTokenSchema } from './schema/jwt-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: JwtToken.name, schema: JwtTokenSchema },
    ]),
    PassportModule,
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
