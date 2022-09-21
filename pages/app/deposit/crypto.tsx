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
import { useTitle } from '@hooks/Title';

import listCurrenciesWithAddresses from '@libs/firebase/functions/currency/address/listCurrenciesWithAddresses';

import { Bidding } from '@components/Bidding';
import { Feature } from '@components/Feature';
import {
  CoinAddress,
  Addresses,
  Coin,
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
  }>(ctx, { freeToAccessBy: 'USER' }, async () => {
    const currencies: Coin[] = (
      await listCurrenciesWithAddresses({
        size: 100,
      })
    ).map(({ logo, name, symbol, uid, quote, walletAddresses: addresses }) => {
      const walletAddresses =
        addresses?.map(({ createdAt, updatedAt, ...address }) => address) ?? [];

      return {
        uid,
        logo,
        name,
        symbol,
        quote,
        walletAddresses,
      } as Coin;
    });

    return {
      props: {
        currencies,
      },
    };
  });
const DepositCrypto: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ currencies: coins }) => {
  useTitle('Deposit Crypto');

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
    <Feature feature="deposit_crypto">
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
    </Feature>
  );
};
export default DepositCrypto;
