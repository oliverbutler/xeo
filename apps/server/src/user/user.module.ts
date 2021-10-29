import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BlockModule } from '../block/block.module';
import { UserResolver } from './user.resolver';
import { UserAdapter } from './user.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() => BlockModule),
  ],
  providers: [UserService, UserResolver, UserAdapter],
  exports: [UserService],
})
export class UserModule {}
