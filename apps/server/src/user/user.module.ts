import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';

@Module({
  providers: [UserResolver, UserService],
  imports: [TypeOrmModule.forFeature([UserRepository])],
})
export class UsersModule {}
