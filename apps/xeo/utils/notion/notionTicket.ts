import { GetDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionDatabaseItem } from './backlog';

export type NotionDatabaseProperty = GetDatabaseResponse['properties'][0];

export const getNotionDatabasePropertyByIdOrName = (
  properties: NotionDatabaseProperty[] | Record<string, NotionDatabaseProperty>,
  idOrName: string | null | undefined
): NotionDatabaseProperty | undefined => {
  if (!idOrName) {
    return undefined;
  }

  if (Array.isArray(properties)) {
    return properties.find(
      (property) =>
        property.id === idOrName ||
        // @ts-ignore
        property?.name === idOrName
    );
  } else {
    const propertyByKey = properties[idOrName];

    if (propertyByKey) {
      return propertyByKey;
    }

    return getNotionDatabasePropertyByIdOrName(
      Object.values(properties),
      idOrName
    );
  }
};

export type NotionDatabaseItemProperty = NotionDatabaseItem['properties'][0];

// One without name
export const getNotionDatabaseItemPropertyByIdOrName = (
  properties:
    | NotionDatabaseItemProperty[]
    | Record<string, NotionDatabaseItemProperty>,
  idOrName: string | null | undefined
): NotionDatabaseItemProperty | undefined => {
  if (!idOrName) {
    return undefined;
  }

  if (Array.isArray(properties)) {
    return properties.find((property) => property.id === idOrName);
  } else {
    const propertyByKey = properties[idOrName];

    if (propertyByKey) {
      return propertyByKey;
    }

    return getNotionDatabaseItemPropertyByIdOrName(
      Object.values(properties),
      idOrName
    );
  }
};
