import { ReactElement, useEffect, useMemo, useState } from 'react';
import {
  fetchAndActivate,
  getAll,
  getRemoteConfig,
} from 'firebase/remote-config';
import { getApp } from 'firebase/app';
import { useSsr } from 'usehooks-ts';

import { Flags, FlagsContext, defaultFlags } from '@store/contexts/Flags';
import { Features } from '@contracts/Features';

interface FlagsProviderProps {
  children: ReactElement;
}
export const FlagsProvider = ({ children }: FlagsProviderProps) => {
  const [flags, setFlags] = useState<Flags>(defaultFlags);

  const [, setLoading] = useState(false);

  const { isBrowser } = useSsr();

  useEffect(() => {
    const isLoadingNow = isBrowser && flags === defaultFlags;

    setLoading(isLoadingNow);
  }, [isBrowser, flags, defaultFlags]);

  useEffect(() => {
    if (isBrowser) {
      const remoteConfig = getRemoteConfig(getApp());

      remoteConfig.settings = {
        minimumFetchIntervalMillis: 1000,
        fetchTimeoutMillis: 1000,
      };
      remoteConfig.defaultConfig = defaultFlags;

      fetchAndActivate(remoteConfig)
        .then(() => getAll(remoteConfig))
        .then((remoteFlags) => {
          const newFlags = { ...flags };

          // eslint-disable-next-line no-restricted-syntax
          for (const [key, config] of Object.entries(remoteFlags)) {
            const keyConfig = key as Features;

            newFlags[keyConfig] = config.asBoolean();
          }
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
    <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>
  );
};
