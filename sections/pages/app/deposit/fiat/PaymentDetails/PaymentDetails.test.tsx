import { act, render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { PaymentDetails } from '.';

import { Request } from '..';

const REQUEST_INFO: Request = {
  id: 'sdsad',
  referenceNumber: 'sdasf',
  amount: 'asdsa',
  currency: 'USD',
};

describe('Payment Details component', () => {
  it('validate render', () => {
    const { getByTestId } = render(
      <PaymentDetails
        handleBackToBegining={() => {}}
        requestInfo={REQUEST_INFO}
      />,
      { wrapper: MemoryRouter }
    );

    const title = getByTestId('title');

    expect(title).toBeInTheDocument();
  });

  it('validate reference number', () => {
    const { getByTestId } = render(
      <PaymentDetails
        handleBackToBegining={() => {}}
        requestInfo={REQUEST_INFO}
      />,
      { wrapper: MemoryRouter }
    );

    const reference = getByTestId('reference-code');

    expect(reference).toHaveTextContent(REQUEST_INFO.referenceNumber);
  });

  it('validate copy', async () => {
    const { getByTestId } = render(
      <PaymentDetails
        handleBackToBegining={() => {}}
        requestInfo={REQUEST_INFO}
      />,
      { wrapper: MemoryRouter }
    );

    const reference = getByTestId('reference-code');
    const accountName = getByTestId('copy-account-name');

    await act(async () => {
      fireEvent.click(accountName);
      fireEvent.click(reference);
    });

    expect(reference).toHaveClass('copied');
    expect(accountName).toHaveClass('copied');
  });
});
