import {
  Block,
  ContentBlockProperties,
  DatabaseProperties,
  PageProperties,
} from '../core/block.entity';

export type BlockFilters = {
  object?: Block['object'];
  parentId?: Block['parentId'] | null;
  createdById?: Block['createdById'];
};

export type PageCreationInput = {
  id?: string;
  properties: PageProperties;
  parentId: Block['parentId'] | null;
  afterId: Block['id'] | null;
  createdById: Block['createdById'];
};

export type DatabaseCreationInput = {
  id?: string;
  properties: DatabaseProperties;
  parentId: Block['parentId'] | null;
  afterId: Block['id'] | null;
  createdById: Block['createdById'];
};

export type ContentBlockCreationInput = {
  id?: string;
  properties: ContentBlockProperties;
  parentId: Block['parentId'] | null;
  afterId: Block['id'] | null;
  createdById: Block['createdById'];
};

export type DatabaseUpdateInput = {
  properties: Partial<DatabaseProperties>;
};

export type PageUpdateInput = {
  properties: Partial<PageProperties>;
};

export type ContentBlockUpdateInput = {
  properties: Partial<ContentBlockProperties> & {
    type: 'paragraph' | 'heading';
  };
};
