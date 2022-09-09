import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { navigation } from '@navigation';

import {
  fetchCoins as fetchCoinsReq,
  Coin as PairedCoin,
} from '@services/api/app/fetchCoins';

import { useRequest } from '@hooks/Request';
import { useTitle } from '@hooks/Title';

import { Bidding } from '@components/Bidding';
import {
  Address,
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

const DepositCrypto = () => {
  useTitle('Deposit Crypto');

  const { push: navigate } = useRouter();

  const { handleRequest } = useRequest(fetchCoinsReq);
  const [fetching, setFetching] = useState<boolean>(true);

  const [pairedCoins, setPairedCoins] = useState<Array<PairedCoin>>([]);
  const coins: Coins = useMemo(
    () =>
      pairedCoins.map(
        ({ uid, logo, name, symbol, price }) =>
          ({ uid, logo, name, symbol, price } as Coin)
      ),
    [pairedCoins]
  );
  const addresses: Addresses = useMemo(
    () =>
      pairedCoins.map(
        ({ uid, walletAddresses }) =>
          ({
            uid,
            walletAddresses,
          } as Address)
      ),
    [pairedCoins]
  );

  const [coinSelectedIndex, setCoinSelectedIndex] = useState<number>(-1);
  const coinSelected = useMemo(
    () => coins[coinSelectedIndex],
    [coins, coinSelectedIndex]
  );

  const [networkSelectedIndex, setNetworkSelectedIndex] = useState<number>(-1);
  const networkSelected = useMemo(
    () => addresses[coinSelectedIndex]?.walletAddresses[networkSelectedIndex],
    [coinSelectedIndex, networkSelectedIndex, addresses]
  );

  useEffect(() => {
    if (!fetching && pairedCoins.length === 0) {
      navigate(navigation.app.wallet);
    }
  }, [fetching, pairedCoins]);

  const fetchCoins = useCallback(async () => {
    const { coins: fetchedPairedCoins } = await handleRequest({
      pageNumber: 1,
      pageSize: 20,
      onlyWithAddres: true,
    });

    setPairedCoins([...fetchedPairedCoins]);
    setFetching(false);
  }, []);
  useEffect(() => {
    fetchCoins();
  }, []);

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
