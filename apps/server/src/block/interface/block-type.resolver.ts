import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('Block')
export class BlockTypeResolver {
  @ResolveField('__resolveType')
  __resolveType(obj: any) {
    if (obj.properties.type === 'PAGE') {
      return 'Page';
    }
    return 'ContentBlock';
  }
}
