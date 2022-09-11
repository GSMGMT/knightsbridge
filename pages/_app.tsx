import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Router from 'next/router';
import NProgress from 'nprogress';

import { Layouts } from '@layouts/index';

import { AuthProvider } from '@store/providers/Auth';

import 'nprogress/nprogress.css';
import '@styles/app.scss';
import { FlagsProvider } from '@store/providers/Flags';

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return (
    <FlagsProvider defaults={{ deposit_fiat: false, sign_in: false }}>
      <AuthProvider>
        <Head>
          <title>KnightsBridge</title>
        </Head>
        <Layouts>
          <Component {...pageProps} />
        </Layouts>
        <Toaster />
      </AuthProvider>
    </FlagsProvider>
  );
};
export default App;
