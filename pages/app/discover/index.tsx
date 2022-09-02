import { GetServerSidePropsContext } from 'next';

import { Main } from '@sections/pages/app/discover/Main';

import { withUser } from '@middlewares/client/withUser';

const Discover = () => <Main />;
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx);
export default Discover;
