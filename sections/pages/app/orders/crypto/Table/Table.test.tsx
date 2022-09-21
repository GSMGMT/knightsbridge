import { act, fireEvent, render } from '@testing-library/react';

import { Table } from '.';

import { Item, User } from '../types';

const user: User = {
  email: 'user@test.com',
  name: 'Test User',
};
const firstItem: Item = {
  date: new Date(),
  uid: '8safdg9',
  amount: 245,
  status: 'CONFIRMED',
  user,
  currency: 'BTC',
  transactionHash: '',
  network: '',
};
const secondItem: Item = {
  date: new Date(),
  uid: '8safdg35239',
  amount: 245,
  status: 'CONFIRMED',
  user,
  currency: 'BTC',
  transactionHash: '',
  network: '',
};
const TestTable = () => (
  <Table
    sortAsceding
    sortByCurrent={undefined}
    items={[firstItem, secondItem]}
    fetching={false}
    handleChangeItemStatus={() => {}}
    handleToggleSelection={() => {}}
    selectedItems={[]}
    setSelectedItems={() => {}}
    handleSetSortBy={() => {}}
    fetchData={() => {}}
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
