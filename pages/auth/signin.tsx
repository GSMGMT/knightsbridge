import { parseCookies } from 'nookies';
import { GetServerSideProps } from 'next';
import cn from 'classnames';

import { Security } from '@components/Security';
import { Login } from '@components/Login';
import { Form } from '@sections/pages/auth/singin/Form';

import styles from '@styles/pages/auth/signin.module.scss';

import { navigation } from '@navigation';

import { adminAuth } from '@libs/firebase/admin-config';

const SignIn = () => (
  <Login
    content="Don’t have an account?"
    linkText="Sign up for free"
    linkUrl={navigation.auth.signUp}
    feature="sign_up"
  >
    <div className={styles.login}>
      <div className={styles.top}>
        <h3 className={cn('h3', styles.title)}>Sign in to Knights</h3>

        <div className={styles.info}>
          Please ensure you are visiting the correct url.
        </div>

        <Security />
      </div>
      <Form />
    </div>
  </Login>
);
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);
    await adminAuth.verifyIdToken(token);

    return {
      redirect: {
        destination: navigation.app.discover,
        permanent: false,
      },
    };
  } catch (err) {
    return {
      props: {},
    };
  }
};
export default SignIn;
