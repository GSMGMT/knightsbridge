import { ReactElement, useEffect, useState } from 'react';
import {
  fetchAndActivate,
  getAll,
  getRemoteConfig,
} from 'firebase/remote-config';
import { getApp } from 'firebase/app';
import { useSsr } from 'usehooks-ts';

import { FlagsContext } from '@store/contexts/Flags';

interface FlagsProviderProps {
  children: ReactElement;
  defaults: { [key: string]: boolean };
}
export const FlagsProvider = ({ defaults, children }: FlagsProviderProps) => {
  const [flags, setFlags] = useState(defaults);

  const [, setLoading] = useState(false);

  const { isBrowser } = useSsr();

  useEffect(() => {
    const isLoadingNow = isBrowser && flags === defaults;

    setLoading(isLoadingNow);
  }, [isBrowser, flags, defaults]);

  useEffect(() => {
    if (isBrowser) {
      const remoteConfig = getRemoteConfig(getApp());

      remoteConfig.settings = {
        minimumFetchIntervalMillis: 1000,
        fetchTimeoutMillis: 1000,
      };
      remoteConfig.defaultConfig = defaults;

      fetchAndActivate(remoteConfig)
        .then((activated) => {
          if (!activated) console.log('not activated');

          return getAll(remoteConfig);
        })
        .then((remoteFlags) => {
          const newFlags = { ...flags };

          // eslint-disable-next-line no-restricted-syntax
          for (const [key, config] of Object.entries(remoteFlags)) {
            newFlags[key] = config.asBoolean();
          }
          setFlags(newFlags);
        });
    }
  }, [isBrowser]);

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
};
