import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { FunctionComponent, useCallback, useMemo, useState } from 'react';

import { Bidding } from '@components/Bidding';
import { Feature } from '@components/Feature';

import { SelectCurrency } from '@sections/pages/app/deposit/fiat/SelectCurrency';
import { ImportantNotes } from '@sections/pages/app/deposit/fiat/ImportantNotes';
import { PaymentDetails } from '@sections/pages/app/deposit/fiat/PaymentDetails';

import { withUser } from '@middlewares/client/withUser';

import { Currency } from '@contracts/Currency';
import { Bank as DefaultBank } from '@contracts/Bank';

import listCurrencies from '@libs/firebase/functions/currency/listCurrencies';
import listBanks from '@libs/firebase/functions/fiat/bank/listBanks';
import { Request } from '@sections/pages/app/deposit/fiat/types';

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
  }>(ctx, { freeToAccessBy: 'USER' }, async () => {
    const currencies: FiatCurrency[] = (
      await listCurrencies({
        filters: { type: 'fiat' },
        size: 100,
      })
    ).map(({ createdAt, updatedAt, deposit, ...data }) => ({ ...data }));
    const banks: Bank[] = (
      await listBanks({
        size: 100,
        sort: [
          {
            field: 'uid',
            orientation: 'asc',
          },
        ],
      })
    ).map(({ createdAt, updatedAt, ...data }) => ({ ...data }));

    return {
      props: {
        currencies,
        banks,
      },
    };
  });
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
    <Feature feature="deposit_fiat">
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
    </Feature>
  );
};
export default DepositFiat;
