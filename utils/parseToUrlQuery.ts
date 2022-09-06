const getKeys = Object.keys as <T>(obj: T) => Array<keyof T>;

export const filterUndefinedProperties = <T extends object>(obj: T) => {
  getKeys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      // eslint-disable-next-line no-param-reassign
      delete obj[key];
    }
  });
};

export const parseToUrlQuery = <T extends object>(data: T): string => {
  filterUndefinedProperties<T>(data);

  return getKeys<T>(data)
    .map((key) => {
      const value = data[key];

      if (!value) return;

      return `${String(key)}=${Array.isArray(value) ? value.join(',') : value}`;
    })
    .join('&');
};
