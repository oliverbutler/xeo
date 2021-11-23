import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['apps/server/**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'apps/server/src/graphql.ts'),
      },
      resolvers: {},
    }),
    PrismaModule,
    UserModule,
    BlockModule,
    AuthModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
