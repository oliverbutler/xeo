import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { BlockService } from './block/block.service';
import { AuthModule } from '../auth/auth.module';
import { BlockTypeResolver } from './block-type.resolver';
import { PageService } from './page/page.service';
import { DatabaseService } from './database/database.service';
import { PageResolver } from './page/page.resolver';
import { BlockResolver } from './block/block.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    PrismaModule,
  ],
  providers: [
    BlockService,
    BlockTypeResolver,
    PageResolver,
    BlockResolver,
    PageService,
    BlockService,
    DatabaseService,
  ],
  exports: [BlockService, PageService, DatabaseService],
})
export class BlockModule {}
