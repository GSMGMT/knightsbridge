import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Successfully } from '.';

import { Request } from '..';

const REQUEST_INFO: Request = {
  amount: '50.00',
  id: '98sfa',
  referenceNumber: 'gsdgh978',
  currency: 'USD',
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
