import { useCallback, useContext } from 'react';

import { Features } from '@contracts/Features';

import { FlagsContext } from '@store/contexts/Flags';

export const useFeature = () => {
  const { flags } = useContext(FlagsContext);

  const isEnabled = useCallback((feature: Features) => flags[feature], [flags]);

  return { isEnabled };
};
