import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { BlockAdapter } from './block.adapter';
import { BlockRepository } from './block.repository';
import { BlockResolver } from './block.resolver';
import { BlockService } from './block.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlockRepository]),
    forwardRef(() => UserModule),
  ],
  providers: [BlockService, BlockResolver, BlockAdapter],
  exports: [BlockService],
})
export class BlockModule {}
