import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from '../user/user.module';
import { BlockModule } from '../block/block.module';
import { Block } from '../block/core/block.entity';
import { User } from '../user/core/user.entity';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ContentProperties } from '../graphql';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'apps/server/src/graphql.ts'),
      },
      resolvers: {
        ContentProperties: {
          __resolveType(obj: ContentProperties) {
            if (obj.type === 'paragraph') {
              return 'ParagraphProperties';
            }
            if (obj.type === 'heading') {
              return 'HeadingProperties';
            }
            return null;
          },
        },
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
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
