import { GetServerSideProps } from 'next';
import { applyActionCode } from 'firebase/auth';
import cn from 'classnames';

import { auth } from '@libs/firebase/config';

import { Login } from '@components/Login';
import { Link } from '@components/Link';

import styles from '@styles/pages/auth/signin.module.scss';

import { navigation } from '@navigation';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { oobCode },
  } = ctx;

  if (!oobCode)
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };

  try {
    await applyActionCode(auth, oobCode as string);

    return {
      props: {},
    };
  } catch (error) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }
};
const Verify = () => (
  <Login
    content="Don’t have an account?"
    linkText="Sign up for free"
    linkUrl={navigation.auth.signUp}
  >
    <div className={styles.login}>
      <div className={styles.top}>
        <h3 className={cn('h3', styles.title)}>User verified</h3>
      </div>
      <Link href="/auth/signin" className="button" style={{ width: '100%' }}>
        Go to Login
      </Link>
    </div>
  </Login>
);
export default Verify;
