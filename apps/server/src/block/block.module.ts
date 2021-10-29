import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { BlockAdapter } from './infrastructure/block.adapter';
import { BlockResolver } from './interface/block.resolver';
import { BlockService } from './core/block.service';
import { BlockRepository } from './infrastructure/block.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockRepository]),
    forwardRef(() => UserModule),
  ],
  providers: [BlockService, BlockResolver, BlockAdapter],
  exports: [BlockService],
})
export class BlockModule {}
