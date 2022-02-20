import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import GraphQLJSON from 'graphql-type-json';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['apps/server/**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'apps/server/src/graphql.ts'),
      },
      resolvers: { JSON: GraphQLJSON },
      driver: ApolloDriver,
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
