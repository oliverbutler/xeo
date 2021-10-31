import { UseGuards } from '@nestjs/common';
import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver('Block')
export class BlockTypeResolver {
  @ResolveField('__resolveType')
  __resolveType(obj: any) {
    if (obj.text) {
      return 'TextBlock';
    }
    if (obj.title) {
      return 'PageBlock';
    }
    return null;
  }
}
