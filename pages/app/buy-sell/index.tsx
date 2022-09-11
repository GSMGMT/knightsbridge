import { GetServerSidePropsContext } from 'next';

import { withUser } from '@middlewares/client/withUser';

import { ExchangeProvider } from '@store/providers/Exchange';

import { Feature } from '@components/Feature';
import { Container } from '@sections/pages/app/buy-sell/Container';

const Exchange = () => (
  <Feature feature="buy_sell">
    <ExchangeProvider>
      <Container />
    </ExchangeProvider>
  </Feature>
);
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'USER' });
export default Exchange;
