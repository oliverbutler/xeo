import {
  Block,
  ContentBlockProperties,
  PageProperties,
} from '../core/block.entity';

export type BlockFilters = {
  object?: Block['object'];
  parentId?: Block['parentId'] | null;
  createdById?: Block['createdById'];
};

export type PageCreationInput = {
  properties: PageProperties;
  parentId: Block['parentId'] | null;
  createdById: Block['createdById'];
};

export type ContentBlockCreationInput = {
  properties: ContentBlockProperties;
  parentId: Block['parentId'] | null;
  createdById: Block['createdById'];
};
