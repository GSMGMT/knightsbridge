import cn from 'classnames';
import { ReactNode } from 'react';

import LogoLight from '../../public/images/logos/logo-text-light.svg';
import LogoDark from '../../public/images/logos/logo-text-dark.svg';

import warrior from '../../public/images/warrior.png';

import styles from './Login.module.scss';

import { Link } from '../Link';

interface LoginProps {
  className?: string;
  content?: string;
  linkText?: string;
  linkUrl?: string;
  children: ReactNode;
  sideImage?: string;
}
export const Login = ({
  className,
  content,
  linkText,
  linkUrl,
  children,
  sideImage,
}: LoginProps) => (
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
      {content && linkText && linkUrl && (
        <div className={styles.head}>
          <span>{content}</span>
          <Link className={styles.link} href={linkUrl}>
            {linkText}
          </Link>
        </div>
      )}
      <div className={styles.wrap}>{children}</div>
    </div>
  </div>
);
Login.defaultProps = {
  className: undefined,
  sideImage: warrior.src,
  content: undefined,
  linkText: undefined,
  linkUrl: undefined,
};
