import { ReactNode, useMemo } from 'react';
import cn from 'classnames';

import { useFeature } from '@hooks/Feature';

import { Features } from '@contracts/Features';

import LogoLight from '@public/images/logos/logo-text-light.svg';
import LogoDark from '@public/images/logos/logo-text-dark.svg';
import warrior from '@public/images/warrior.png';

import { Link } from '@components/Link';

import styles from './Login.module.scss';

type Action =
  | {
      linkText: string;
      linkUrl: string;
      feature: Features;
    }
  | {
      linkText?: never;
      linkUrl?: never;
      feature?: never;
    };
type LoginProps = Action & {
  className?: string;
  content?: string;
  children: ReactNode;
  sideImage?: string;
};
export const Login = ({
  className,
  content,
  linkText,
  linkUrl,
  children,
  sideImage,
  feature,
}: LoginProps) => {
  const { isEnabled } = useFeature();

  const canAction = useMemo(() => {
    if (!feature) return false;

    return isEnabled(feature);
  }, [isEnabled, feature]);

  return (
    <div className={cn(className, styles.login)}>
      <div
        className={styles.col}
        style={{
          backgroundImage: `url('${sideImage}')`,
        }}
      >
        <Link className={styles.logo} href="/">
          <LogoDark className={styles.dark} />
          <LogoLight className={styles.light} />
        </Link>
      </div>
      <div className={styles.col}>
        {canAction && (content || linkText) && (
          <div className={styles.head}>
            <span>{content}</span>
            {linkText && (
              <Link className={styles.link} href={linkUrl}>
                {linkText}
              </Link>
            )}
          </div>
        )}
        <div className={styles.wrap}>{children}</div>
      </div>
    </div>
  );
};
Login.defaultProps = {
  className: undefined,
  sideImage: warrior.src,
  content: undefined,
};
