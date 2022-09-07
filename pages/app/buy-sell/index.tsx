import { GetServerSidePropsContext } from 'next';

import { withUser } from '@middlewares/client/withUser';

import { ExchangeProvider } from '@store/providers/Exchange';

import { Container } from '@sections/pages/app/buy-sell/Container';

const Exchange = () => (
  <ExchangeProvider>
    <Container />
  </ExchangeProvider>
);
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'USER' });
export default Exchange;
