const getKeys = Object.keys as <T>(obj: T) => Array<keyof T>;

export const parseToUrlQuery = <T extends object>(data: T): string =>
  getKeys<T>(data)
    .map((key) => {
      const value = data[key];
      return `${String(key)}=${Array.isArray(value) ? value.join(',') : value}`;
    })
    .join('&');
