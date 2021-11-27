import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { PageService } from './page/page.service';
import { DatabaseService } from './database/database.service';
import { PageResolver } from './page/page.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { PageLinkService } from './page-link/page-link.service';
import { PageLinkResolver } from './page-link/page-link.resolver';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    PrismaModule,
  ],
  providers: [
    PageResolver,
    PageLinkResolver,
    PageService,
    DatabaseService,
    PageLinkService,
  ],
  exports: [PageService, DatabaseService],
})
export class BlockModule {}
