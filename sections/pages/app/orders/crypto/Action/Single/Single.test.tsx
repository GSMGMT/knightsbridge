import { act, fireEvent, render } from '@testing-library/react';

import { Single } from '.';

import { Item, User, Variant } from '../../types';

const user: User = {
  email: 'user@test.com',
  name: 'Test User',
};
const item: Item = {
  date: new Date(),
  uid: '8safdg9',
  amount: 245,
  status: 'CONFIRMED',
  user,
  currency: 'BTC',
  transactionHash: '',
  network: '',
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
    expect(referenceNumberTitleElement).toHaveTextContent(item.uid);

    const userNameElement = getByTestId('user-name');
    expect(userNameElement).toHaveTextContent(user.name);

    const userEmailElement = getByTestId('user-email');
    expect(userEmailElement).toHaveTextContent(user.email);

    const referenceNumberElement = getByTestId('reference-number');
    expect(referenceNumberElement).toHaveTextContent(item.uid);

    const currencyCodeElement = getByTestId('currency-code');
    expect(currencyCodeElement).toHaveTextContent(item.uid);

    const quantityElement = getByTestId('quantity');
    expect(quantityElement).toHaveTextContent(String(item.amount));
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
