import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('Block')
export class BlockTypeResolver {
  @ResolveField('__resolveType')
  __resolveType(obj: any) {
    if (obj.properties.type === 'page') {
      return 'Page';
    }
    return 'ContentBlock';
  }
}
