import { act, fireEvent, render } from '@testing-library/react';

import { Table } from '.';

import { Currency, Item, PaymentMethod, User } from '../types';

const currency: Currency = { code: 'USD', id: '7dgf0asd', quote: 1.3 };
const method: PaymentMethod = { name: 'Bank (SWIFT)', type: 'Bangkok Bank' };
const user: User = {
  email: 'user@test.com',
  name: 'Test User',
};
const firstItem: Item = {
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
const secondItem: Item = {
  currency,
  date: new Date(),
  id: 'sd78ghasd',
  method,
  quantity: 245,
  receipt: '8s7hdgf',
  referenceIdentifier: 'asdf67b',
  status: 'CONFIRMED',
  user,
};
const TestTable = () => (
  <Table
    sortAsceding
    sortByCurrent={undefined}
    items={[firstItem, secondItem]}
    fetching={false}
    canAction
    handleChangeItemStatus={() => {}}
    handleToggleSelection={() => {}}
    selectedItems={[]}
    setSelectedItems={() => {}}
    handleSetSortBy={() => {}}
  />
);

describe('Table Component', () => {
  it('should render correctly', () => {
    const { getByTestId } = render(<TestTable />);

    const tableItem = getByTestId('table-item-1');

    expect(tableItem).toBeInTheDocument();
  });

  it('should be able to handle action', async () => {
    const { getByTestId, debug } = render(<TestTable />);

    const tableItem = getByTestId('table-item-1');

    await act(async () => {
      fireEvent.click(tableItem);
    });

    debug();

    expect(tableItem).toHaveClass('active');
  });
});
