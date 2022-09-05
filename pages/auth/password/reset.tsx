import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { verifyPasswordResetCode } from 'firebase/auth';

import { auth } from '@libs/firebase/config';

import { Form } from '@sections/pages/auth/reset/Form';
import { Login } from '@components/Login';

import user from '@public/images/user.png';

import { navigation } from '@navigation';
import { parseCookies } from 'nookies';
import { adminAuth } from '@libs/firebase/admin-config';

export const getServerSideProps: GetServerSideProps<{ email: string }> = async (
  ctx
) => {
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
    const { oobCode } = ctx.query;

    try {
      const email = await verifyPasswordResetCode(auth, oobCode as string);

      return { props: { email } };
    } catch (error) {
      return { redirect: { destination: '/auth/signin', permanent: false } };
    }
  }
};
const Reset = ({
  email,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <Login
    content="Don’t have an account?"
    linkText="Sign up for free"
    linkUrl={navigation.auth.signUp}
    sideImage={user.src}
  >
    <Form email={email} />
  </Login>
);
export default Reset;
