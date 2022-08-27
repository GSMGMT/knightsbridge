import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { clearAllBodyScrollLocks } from 'body-scroll-lock';

import styles from './Page.module.scss';

import { Header } from '../Header';
import { Footer } from '../Footer';

interface PageProps {
  headerHide?: boolean;
  footerHide?: boolean;
  headerWide?: boolean;
  children?: ReactNode;
}
export const Page = ({
  headerHide,
  children,
  footerHide,
  headerWide,
}: PageProps) => {
  const { pathname } = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
    clearAllBodyScrollLocks();
  }, [pathname]);

  return (
    <div className={styles.page}>
      {!headerHide && <Header headerWide={headerWide} />}
      <div className={styles.inner}>{children}</div>
      {!footerHide && <Footer />}
    </div>
  );
};
Page.defaultProps = {
  headerHide: false,
  footerHide: false,
  headerWide: false,
  children: undefined,
};
