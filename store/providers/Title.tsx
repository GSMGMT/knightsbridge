import { useState, ReactElement, FunctionComponent } from 'react';

import { TitleContext, defaulTitle } from '@store/contexts/Title';
import Head from 'next/head';

interface TitleProviderProps {
  children: ReactElement;
}

export const TitleProvider: FunctionComponent<TitleProviderProps> = ({
  children,
}) => {
  const [title] = useState<string>(defaulTitle);

  return (
    <TitleContext.Provider value={title}>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </TitleContext.Provider>
  );
};
