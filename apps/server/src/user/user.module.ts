import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserResolver } from './user.resolver';
import { BlockService } from '../block/block.service';
import { BlockRepository } from '../block/block.repository';

@Module({
  providers: [UserResolver, UserService, BlockService],
  imports: [TypeOrmModule.forFeature([UserRepository, BlockRepository])],
})
export class UsersModule {}
