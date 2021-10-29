import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { UserService } from '../user/user.service';
import { BlockRepository } from './block.repository';
import { BlockResolver } from './block.resolver';
import { BlockService } from './block.service';

@Module({
  providers: [BlockResolver, BlockService, UserService],
  imports: [TypeOrmModule.forFeature([BlockRepository, UserRepository])],
})
export class BlockModule {}
