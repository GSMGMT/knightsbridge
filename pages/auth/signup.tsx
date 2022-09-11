import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';

import { Login } from '@components/Login';
import { Feature } from '@components/Feature';
import { Form } from '@sections/pages/auth/signup/Form';

import { navigation } from '@navigation';

import { adminAuth } from '@libs/firebase/admin-config';

const SignUp = () => (
  <Feature feature="sign_up">
    <Login
      content="Already have an account?"
      linkText="Login"
      linkUrl={navigation.auth.signIn}
      feature="sign_in"
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
export default SignUp;
