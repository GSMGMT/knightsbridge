import { ReactElement, useEffect, useMemo, useState } from 'react';
import {
  fetchAndActivate,
  getAll,
  getRemoteConfig,
} from 'firebase/remote-config';
import { getApp } from 'firebase/app';
import { useSsr } from 'usehooks-ts';

import { Loading } from '@components/Loading';

import { Flags, FlagsContext, defaultFlags } from '@store/contexts/Flags';

import { Features } from '@contracts/Features';

interface FlagsProviderProps {
  children: ReactElement;
}
export const FlagsProvider = ({ children }: FlagsProviderProps) => {
  const [flags, setFlags] = useState<Flags>(defaultFlags);

  const [loading, setLoading] = useState(false);

  const { isBrowser } = useSsr();

  useEffect(() => {
    const isLoadingNow = isBrowser && flags === defaultFlags;

    setLoading(isLoadingNow);
  }, [isBrowser, flags, defaultFlags]);

  useEffect(() => {
    if (isBrowser) {
      const remoteConfig = getRemoteConfig(getApp());

      remoteConfig.settings = {
        minimumFetchIntervalMillis: 60000,
        fetchTimeoutMillis: 60000,
      };
      remoteConfig.defaultConfig = defaultFlags;

      fetchAndActivate(remoteConfig)
        .then(() => getAll(remoteConfig))
        .then((remoteFlags) => {
          const newFlags = { ...flags };

          Object.entries(remoteFlags).forEach(([key, config]) => {
            const keyConfig = key as Features;

            newFlags[keyConfig] = config.asBoolean();
          });

          setFlags(newFlags);
        });
    }
  }, [isBrowser]);

  const value = useMemo(
    () => ({
      flags,
    }),
    [flags]
  );

  return (
    <FlagsContext.Provider value={value}>
      {loading ? <Loading /> : children}
    </FlagsContext.Provider>
  );
};
