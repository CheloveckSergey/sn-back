import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { FileService } from './file.service';
import { AuthorModule } from 'src/author/author.module';
import { Author_Subs } from 'src/author/author-subs.model';

@Module({
  controllers: [UsersController],
  providers: [UsersService, FileService],
  imports: [
    SequelizeModule.forFeature([User, Author_Subs]),
    RolesModule,
    forwardRef(() => AuthModule),
    AuthorModule,
  ],
  exports: [
    UsersService,
  ]
})
export class UsersModule {}
