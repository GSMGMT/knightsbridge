import { GetServerSidePropsContext } from 'next';
import { useCallback, useMemo, useState } from 'react';

import { Bidding } from '@components/Bidding';

import { SelectCurrency } from '@sections/pages/app/deposit/fiat/SelectCurrency';
import { ImportantNotes } from '@sections/pages/app/deposit/fiat/ImportantNotes';
import { PaymentDetails } from '@sections/pages/app/deposit/fiat/PaymentDetails';

import { withUser } from '@middlewares/client/withUser';

const steps = [
  { title: 'Select currency', slug: 'currency' },
  { title: 'Important notes', slug: 'notes' },
  { title: 'Payment details', slug: 'details' },
];

export interface Request {
  id: string;
  referenceNumber: string;
  amount: string;
  currency: string;
}

const DepositFiat = () => {
  const [requestInfo, setRequestInfo] = useState<Request>({
    id: '',
    referenceNumber: '',
    amount: '',
    currency: '',
  });
  const referenceNumber = useMemo(
    () => requestInfo.referenceNumber,
    [requestInfo]
  );

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
        />
      )}
      {activeIndex === 1 && (
        <ImportantNotes
          referenceNumber={referenceNumber}
          goNext={handleNextStep}
        />
      )}
      {activeIndex === 2 && (
        <PaymentDetails
          requestInfo={requestInfo}
          handleBackToBegining={handleBackToBegining}
        />
      )}
    </Bidding>
  );
};
export const getServerSideProps = (ctx: GetServerSidePropsContext) =>
  withUser(ctx);
export default DepositFiat;
