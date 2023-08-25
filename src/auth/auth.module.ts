import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './refreshTokens.model';
import { UserDescModule } from 'src/user-desc/user-desc.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([
      RefreshToken,
    ]),
    UserDescModule,
  ],
  exports: [
    AuthService,
  ]
})
export class AuthModule {}
