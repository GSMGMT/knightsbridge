import { act, fireEvent, render } from '@testing-library/react';

import { Single } from '.';

import { Item, User, Variant } from '../../types';

const user: User = {
  email: 'user@test.com',
  name: 'Test User',
};
const item: Item = {
  date: new Date(),
  id: '8safdg9',
  quantity: 245,
  status: 'APPROVED',
  user,
  exchange: { name: 'Binance' },
  fee: 0.01,
  pair: { name: 'BTC/USDT' },
  price: 0.000001,
  total: 0.000001,
  type: 'BUY',
};

const variant: Variant = 'APPROVE';

const SingleTest = () => (
  <Single
    item={item}
    isSelectedItem
    variant={variant}
    handleClose={() => {}}
    handleChangeItemStatus={() => {}}
  />
);

describe('Single item action', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<SingleTest />);

    const content = getByTestId('content');

    expect(content).toBeInTheDocument();
  });

  it('should show data correctly', () => {
    const { getByTestId } = render(<SingleTest />);

    const variantElement = getByTestId('variant');
    expect(variantElement).toHaveTextContent(variant);

    const referenceNumberTitleElement = getByTestId('reference-number-title');
    expect(referenceNumberTitleElement).toHaveTextContent(item.id);

    const userNameElement = getByTestId('user-name');
    expect(userNameElement).toHaveTextContent(user.name);

    const userEmailElement = getByTestId('user-email');
    expect(userEmailElement).toHaveTextContent(user.email);

    const referenceNumberElement = getByTestId('reference-number');
    expect(referenceNumberElement).toHaveTextContent(item.id);

    const currencyCodeElement = getByTestId('currency-code');
    expect(currencyCodeElement).toHaveTextContent(item.id);

    const quantityElement = getByTestId('quantity');
    expect(quantityElement).toHaveTextContent(String(item.quantity));
  });

  it('should be disabled when fetching', async () => {
    const { getByTestId } = render(<SingleTest />);

    const confirmButton = getByTestId('confirm-button');
    const cancelButton = getByTestId('cancel-button');

    await act(async () => {
      fireEvent.click(confirmButton);
    });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });
});
