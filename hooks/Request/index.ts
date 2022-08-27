import { useCallback, useState } from 'react';

export const useRequest = <T extends (...args: any[]) => Promise<any>>(
  request: T
) => {
  const [fetching, setFetching] = useState<boolean>(false);

  const handleRequest: (...args: Parameters<T>) => Promise<ReturnType<T>> =
    useCallback(
      async (...args) => {
        if (fetching) {
          return;
        }

        setFetching(true);

        const data = await request(...args);

        setFetching(false);

        return { ...data };
      },
      [request, fetching]
    );

  return { fetching, handleRequest };
};
