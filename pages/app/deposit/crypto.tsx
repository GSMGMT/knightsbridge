import { useRouter } from 'next/router';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { withUser } from '@middlewares/client/withUser';

import { navigation } from '@navigation';

import { Bidding } from '@components/Bidding';
import {
  CoinAddress,
  Addresses,
  Coins,
} from '@sections/pages/app/deposit/crypto/types';
import { DepositDetails } from '@sections/pages/app/deposit/crypto/DepositDetails';
import { ConfirmDeposit } from '@sections/pages/app/deposit/crypto/ConfirmDeposit';

const steps = [
  { title: 'Deposit details', slug: 'details' },
  { title: 'Confirm deposit', slug: 'confirm' },
];

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withUser<{
    currencies: Coins;
  }>(ctx, { freeToAccessBy: 'USER' }, async () => ({
    props: {
      currencies: [
        {
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
          name: 'Bitcoin',
          symbol: 'BTC',
          uid: 'baa1b2e0-5b9a-11eb-ae93-0242ac130002',
          quote: 20000,
          walletAddresses: [
            {
              address: '0x1234567890',
              createdAt: new Date(),
              network: 'ETH',
              uid: 'baa1b2e0-5b9a-11eb-ae93-0242ac130002',
              updatedAt: new Date(),
            },
          ],
        },
      ],
    },
  }));
const DepositCrypto: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ currencies: coins }) => {
  const { push: navigate } = useRouter();

  const [fetching] = useState<boolean>(false);

  const addresses: Addresses = useMemo(
    () =>
      coins.map(
        ({ uid, walletAddresses }) =>
          ({
            uid,
            walletAddresses,
          } as CoinAddress)
      ),
    [coins]
  );

  const [coinSelectedIndex, setCoinSelectedIndex] = useState<number>(0);
  const coinSelected = useMemo(
    () => coins[coinSelectedIndex],
    [coins, coinSelectedIndex]
  );

  const [networkSelectedIndex, setNetworkSelectedIndex] = useState<number>(0);
  const networkSelected = useMemo(
    () => addresses[coinSelectedIndex].walletAddresses[networkSelectedIndex],
    [coinSelectedIndex, networkSelectedIndex, addresses]
  );

  useEffect(() => {
    if (!fetching && coins.length === 0) {
      navigate(navigation.app.wallet);
    }
  }, [fetching, coins]);

  const [amount, setAmount] = useState<number>(0);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleNextStep = useCallback(() => {
    setActiveIndex(activeIndex + 1);
  }, [activeIndex]);
  const handleBackStep = useCallback(() => {
    setActiveIndex(activeIndex - 1);
  }, [activeIndex]);

  return (
    <Bidding title="Deposit crypto" items={steps} activeIndex={activeIndex}>
      {!fetching && (
        <>
          {activeIndex === 0 && (
            <DepositDetails
              goNext={handleNextStep}
              coins={coins}
              addresses={addresses}
              setAmount={setAmount}
              setCoinSelectedIndex={setCoinSelectedIndex}
              setNetworkSelectedIndex={setNetworkSelectedIndex}
            />
          )}
          {activeIndex === 1 && (
            <ConfirmDeposit
              amount={amount}
              coinSelected={coinSelected}
              networkSelected={networkSelected}
              goNext={handleNextStep}
              goBack={handleBackStep}
            />
          )}
        </>
      )}
    </Bidding>
  );
};
export default DepositCrypto;
