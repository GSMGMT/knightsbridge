import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';

import { Bidding } from '@components/Bidding';

import { SelectCurrency } from '@sections/pages/app/deposit/fiat/SelectCurrency';
import { ImportantNotes } from '@sections/pages/app/deposit/fiat/ImportantNotes';
import { PaymentDetails } from '@sections/pages/app/deposit/fiat/PaymentDetails';
import { Request } from '@sections/pages/app/deposit/fiat/types';

import { withUser } from '@middlewares/client/withUser';

import { Currency } from '@contracts/Currency';
import { Bank as DefaultBank } from '@contracts/Bank';

export type FiatCurrency = Omit<Currency, 'createdAt' | 'updatedAt'>;
export type Bank = Omit<DefaultBank, 'createdAt' | 'updatedAt'>;

const steps = [
  { title: 'Select currency', slug: 'currency' },
  { title: 'Important notes', slug: 'notes' },
  { title: 'Payment details', slug: 'details' },
];

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  withUser<{
    currencies: FiatCurrency[];
    banks: Bank[];
  }>(ctx, { freeToAccessBy: 'USER' }, async () => ({
    props: {
      currencies: [
        {
          cmcId: 2781,
          logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2781.png',
          symbol: 'USD',
          name: 'US Dollar',
          type: 'fiat',
          uid: 'f2a8b0e0-5f9a-4b1a-8b0e-05f9a4b1a8b0',
          deposit: true,
          quote: 1,
          sign: '$',
          walletAddresses: [],
        },
      ],
      banks: [
        {
          accountName: 'Binance',
          accountNumber: '123456789',
          address: 'Binance',
          bankAddress: 'Binance',
          bankName: 'Binance',
          branch: 'Binance',
          paymentMethod: 'Binance',
          swiftCode: 'Binance',
          uid: 'c2a8b0e0-5f9a-4b1a-8b0e-05f9a4b1a8b0',
        },
      ],
    },
  }));
const DepositFiat: FunctionComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ currencies, banks }) => {
  const [requestInfo, setRequestInfo] = useState<Request | undefined>();
  const referenceNumber = useMemo(() => {
    const currentReferenceNumber = requestInfo?.referenceNumber || '';

    return currentReferenceNumber;
  }, [requestInfo]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleNextStep = useCallback(() => {
    setActiveIndex(activeIndex + 1);
  }, [activeIndex]);
  const handleBackToBegining = useCallback(() => {
    setActiveIndex(0);
  }, []);

  return (
    <Bidding title="Deposit fiat" items={steps} activeIndex={activeIndex}>
      {activeIndex === 0 && (
        <SelectCurrency
          goNext={handleNextStep}
          setRequestInfo={setRequestInfo}
          banks={banks}
          currencies={currencies}
        />
      )}
      {requestInfo &&
        (activeIndex === 1 ? (
          <ImportantNotes
            referenceNumber={referenceNumber}
            goNext={handleNextStep}
          />
        ) : (
          activeIndex === 2 && (
            <PaymentDetails
              requestInfo={requestInfo}
              handleBackToBegining={handleBackToBegining}
            />
          )
        ))}
    </Bidding>
  );
};
export default DepositFiat;
