import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { Form } from '@sections/pages/auth/forgot/Form';
import { Feature } from '@components/Feature';
import { Login } from '@components/Login';

import user from '@public/images/user.png';

import { navigation } from '@navigation';

import { adminAuth } from '@libs/firebase/admin-config';

const ForgotPassword = () => (
  <Feature feature="forgot_password">
    <Login
      content="Don’t have an account?"
      linkText="Sign up for free"
      linkUrl={navigation.auth.signUp}
      sideImage={user.src}
      feature="sign_up"
    >
      <Form />
    </Login>
  </Feature>
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
export default ForgotPassword;
