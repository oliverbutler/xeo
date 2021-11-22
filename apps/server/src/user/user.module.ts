import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { BlockModule } from '../block/block.module';
import { UserResolver } from './user.resolver';
import { UserAdapter } from './user.adapter';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [forwardRef(() => BlockModule), PrismaModule],
  providers: [UserService, UserResolver, UserAdapter],
  exports: [UserService],
})
export class UserModule {}
