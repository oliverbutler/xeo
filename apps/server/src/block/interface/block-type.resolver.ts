import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('Block')
export class BlockTypeResolver {
  @ResolveField('__resolveType')
  __resolveType(obj: any) {
    switch (obj.properties.type) {
      case 'page':
        return 'Page';
      case 'database':
        return 'Database';
      default:
        return 'ContentBlock';
    }
  }
}
