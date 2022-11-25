import { GetServerSidePropsContext } from 'next';

import { Main } from '@sections/pages/app/discover/Main';
import { Details } from '@sections/pages/app/discover/Details';

import { withUser } from '@middlewares/client/withUser';

const Discover = () => (
  <div>
    <Main />
    <Details />
  </div>
);
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx);
export default Discover;
