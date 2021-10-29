import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { Block } from './block/block.entity';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'apps/server/src/graphql.ts'),
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5438,
      username: 'postgres',
      password: 'postgres',
      database: 'xeo',
      entities: [User, Block],
      synchronize: true,
    }),
    UserModule,
    BlockModule,
  ],
  providers: [],
})
export class AppModule {}
