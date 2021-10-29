import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { User } from './user/user.entity';
import { UsersModule } from './user/user.module';
import { UserRepository } from './user/user.repository';
import { UserService } from './user/user.service';
import { BlockModule } from './block/block.module';
import { BlockService } from './block/block.service';
import { Block } from './block/block.entity';
import { BlockRepository } from './block/block.repository';

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
    UsersModule,
    BlockModule,
  ],
  controllers: [],
  providers: [UserService, UserRepository, BlockService, BlockRepository],
})
export class AppModule {}
