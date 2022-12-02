import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Successfully } from '.';

import { Request } from '../types';

const REQUEST_INFO: Request = {
  amount: '50.00',
  id: '98sfa',
  referenceNumber: 'gsdgh978',
  bank: {
    accountName: 'John Doe',
    accountNumber: '1234567890',
    bankName: 'Bank of America',
    uid: '123',
    address: '123 Main St',
    bankAddress: '123 Main St',
    branch: '123 Main St',
    paymentMethod: 'bank',
    swiftCode: '123',
  },
  currency: {
    cmcId: 1,
    logo: 'https://example.com',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: 'crypto',
    uid: '123',
  },
};

describe('Successfully component', () => {
  it('validate render', () => {
    const { getByTestId } = render(
      <Successfully requestInfo={REQUEST_INFO} />,
      { wrapper: MemoryRouter }
    );

    const successBox = getByTestId('success-box');

    expect(successBox).toBeInTheDocument();
  });

  it('validate if info are correct', () => {
    const { getByTestId } = render(
      <Successfully requestInfo={REQUEST_INFO} />,
      { wrapper: MemoryRouter }
    );

    const amount = getByTestId('amount');
    const id = getByTestId('id');

    expect(amount).toHaveTextContent(`${REQUEST_INFO.amount} USD`);
    expect(id).toHaveTextContent(REQUEST_INFO.id);
  });
});
