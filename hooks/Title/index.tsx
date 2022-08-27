import { useEffect } from 'react';

export const useTitle = (newTitle: string) => {
  useEffect(() => {
    document.title = `KnightsBridge | ${newTitle}`;

    return () => {
      document.title = 'KnightsBridge';
    };
  }, [newTitle]);
};
