import { act, fireEvent, render } from '@testing-library/react';

import { Single } from '.';

import { Currency, Item, PaymentMethod, User, Variant } from '../../types';

const currency: Currency = { code: 'USD', id: '7dgf0asd', quote: 1.3 };
const method: PaymentMethod = { name: 'Bank (SWIFT)', type: 'Bangkok Bank' };
const user: User = {
  email: 'user@test.com',
  name: 'Test User',
};
const item: Item = {
  currency,
  date: new Date(),
  id: '8safdg9',
  method,
  quantity: 245,
  receipt: '8s7hdgf',
  referenceIdentifier: 'asdf67b',
  status: 'CONFIRMED',
  user,
};

const variant: Variant = 'CONFIRM';

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
    expect(referenceNumberTitleElement).toHaveTextContent(
      item.referenceIdentifier
    );

    const userNameElement = getByTestId('user-name');
    expect(userNameElement).toHaveTextContent(user.name);

    const userEmailElement = getByTestId('user-email');
    expect(userEmailElement).toHaveTextContent(user.email);

    const referenceNumberElement = getByTestId('reference-number');
    expect(referenceNumberElement).toHaveTextContent(item.referenceIdentifier);

    const currencyCodeElement = getByTestId('currency-code');
    expect(currencyCodeElement).toHaveTextContent(item.currency.code);

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
