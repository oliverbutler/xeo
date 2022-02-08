export type DeveloperWithCapacity = {
  name: string;
  capacity: number[];
};

export const isDeveloperWithCapacityArray = (
  developers: unknown
): developers is DeveloperWithCapacity[] => {
  if (!Array.isArray(developers)) {
    return false;
  }

  return developers.every((developer): developer is DeveloperWithCapacity => {
    if (typeof developer !== 'object') {
      return false;
    }

    if (typeof developer.name !== 'string') {
      return false;
    }

    if (!Array.isArray(developer.capacity)) {
      return false;
    }

    return developer.capacity.every(
      (capacity: any): capacity is number => typeof capacity === 'number'
    );
  });
};
