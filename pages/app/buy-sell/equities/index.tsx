import { GetServerSidePropsContext } from 'next';

import { withUser } from '@middlewares/client/withUser';

import { EquitiesProvider } from '@store/providers/Equities';

import { Container } from '@sections/pages/app/buy-sell/equities/Container';

const Exchange = () => (
  <EquitiesProvider>
    <Container />
  </EquitiesProvider>
);
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'USER' });
export default Exchange;
