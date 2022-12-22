import { GetServerSidePropsContext } from 'next';

import { withUser } from '@middlewares/client/withUser';

import { EquitiesProvider } from '@store/providers/Equities';

import { Feature } from '@components/Feature';
import { Container } from '@sections/pages/app/buy-sell/equities/Container';

const Exchange = () => (
  <Feature feature="buy_sell">
    <EquitiesProvider>
      <Container />
    </EquitiesProvider>
  </Feature>
);
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx, { freeToAccessBy: 'USER' });
export default Exchange;
