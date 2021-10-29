import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './core/user.service';
import { UserRepository } from './infrastructure/user.repository';
import { BlockModule } from '../block/block.module';
import { UserResolver } from './interface/user.resolver';
import { UserAdapter } from './infrastructure/user.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() => BlockModule),
  ],
  providers: [UserService, UserResolver, UserAdapter],
  exports: [UserService],
})
export class UserModule {}
