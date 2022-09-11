import { FunctionComponent, ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Features } from '@contracts/Features';

import { useFeature } from '@hooks/Feature';

interface FeatureProps {
  feature: Features;
  children: ReactElement;
  restrict?: 'PAGE' | 'COMPONENT';
}
export const Feature: FunctionComponent<FeatureProps> = ({
  feature,
  children,
  restrict,
}) => {
  const { push } = useRouter();

  const { isEnabled } = useFeature();

  useEffect(() => {
    if (!isEnabled(feature) && restrict === 'PAGE') {
      push('/');
    }
  }, [isEnabled, feature, restrict]);

  return restrict === 'COMPONENT' && !isEnabled(feature) ? null : children;
};
Feature.defaultProps = {
  restrict: 'PAGE',
};
