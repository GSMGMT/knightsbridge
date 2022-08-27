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

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
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
    <AuthProvider>
      <Head>
        <title>Welcome to knightsbridge!</title>
      </Head>
      <Layouts>
        <Component {...pageProps} />
      </Layouts>
      <Toaster />
    </AuthProvider>
  );
};
export default App;
